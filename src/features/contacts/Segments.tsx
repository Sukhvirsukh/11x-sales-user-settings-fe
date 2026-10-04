import type { Column } from "@/components/design/CustomTable"
import CustomTable from "@/components/design/CustomTable"
import SearchField from "@/components/shared/SearchField"
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCan } from "@/features/auth"
import { debounce } from "@/lib/utils"
import { Download, Plus, Trash } from "lucide-react"
import { useRef, useState } from "react"
import { useSearchParams } from "react-router"
import { format as formatDate } from "date-fns"
import { downloadSegment } from "./contactsApi"
import DeleteContacts from "./DeleteContacts"
import { useSegmentsQuery } from "./contactQuery"
import type { Segment, SegmentRules } from "./contactType"
import AddSegment from "./AddSegment"


const WHO_LABEL: Record<SegmentRules["who"], string> = {
    everyone: "Everyone",
    customers: "Customers",
    leads: "Leads",
}

/** One line describing a segment's rules, e.g. "Customers · chatted in 30 days · asked about returns". */
function describeRules(rules?: SegmentRules): string {
    if (!rules) return ""
    const parts = [WHO_LABEL[rules.who] ?? "Everyone"]
    if (rules.activeWithinDays) parts.push(`chatted in ${rules.activeWithinDays} days`)
    if (rules.askedAbout) parts.push(`asked about “${rules.askedAbout}”`)
    if (rules.consentOnly) parts.push("marketing consent")
    return parts.join(" · ")
}

function formatDay(value: unknown): string {
    if (!value) return "—"
    const date = new Date(String(value))
    return Number.isNaN(date.getTime()) ? "—" : formatDate(date, "MMM d, yyyy")
}

const columns: Column[] = [
    {
        key: "name",
        header: "Segment",
        width: "340px",
        render: (value, row) => (
            <span className="flex min-w-0 flex-col">
                <span className="truncate font-medium text-foreground">{String(value)}</span>
                <span className="truncate text-sm text-muted-foreground">{describeRules((row as Segment).rules)}</span>
            </span>
        ),
    },
    {
        key: "status",
        header: "Status",
        render: (value, row) => {
            const active = value === "Active"
            return (
                <Badge variant={active ? "default" : "warning"}>
                    {active ? "Active" : `Starts ${formatDay((row as Segment).activeSchedule)}`}
                </Badge>
            )
        },
    },
    {
        key: "activeUsers",
        header: "Contacts",
        align: "right",
        render: (value) => <span className="tabular font-medium">{Number(value ?? 0).toLocaleString()}</span>,
    },
    { key: "createdAt", header: "Created", align: "right", render: (value) => formatDay(value) },
]

export default function Segments() {
    // Adding a segment is a change, so the button follows `contacts.create` alone.
    // The permissions table grants create and edit together under "Changes", and
    // create implies edit — so `create` is the whole change capability.
    const canCreateSegments = useCan("contacts.create")
    // Deleting is its own grant, so it is asked for separately.
    const canDeleteSegments = useCan("contacts.delete")
    const [searchParams, setSearchParams] = useSearchParams()
    const setSearchParamsRef = useRef(setSearchParams)
    setSearchParamsRef.current = setSearchParams
    const search = searchParams.get("search") ?? ""
    const pageParam = Number(searchParams.get("page"))
    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1

    const [deleteRequest, setDeleteRequest] = useState<{
        rows: Segment[]
        onDeleted?: (ids: string[]) => void
    } | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)

    const { data, isLoading, error } = useSegmentsQuery(page, search.trim())
    const segments = data?.items ?? []
    const total = data?.total ?? 0
    const pageSize = data?.pageSize ?? 10

    if (error) throw error

    const handleSearchChange = useRef(
        debounce((value: string) => {
            setSearchParamsRef.current((currentParams) => {
                const nextParams = new URLSearchParams(currentParams)
                if (value) nextParams.set("search", value)
                else nextParams.delete("search")
                nextParams.delete("page")
                return nextParams
            }, { replace: true })
        }),
    ).current

    function handlePageChange(nextPage: number) {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)
            if (nextPage === 1) nextParams.delete("page")
            else nextParams.set("page", String(nextPage))
            return nextParams
        })
    }

    function handleDeleteModalChange(open: boolean) {
        setIsDeleteOpen(open)
        if (!open) setDeleteRequest(null)
    }

    function requestDelete(rows: Segment[], onDeleted?: (ids: string[]) => void) {
        setDeleteRequest({ rows, onDeleted })
        setIsDeleteOpen(true)
    }

    function handleAddModalChange(open: boolean) {
        setIsAddOpen(open)
    }

    return (
        <>
            <CustomTable
                title="Segments"
                description="Saved groups of contacts. Counts update as people chat and buy."
                columns={columns}
                data={segments}
                selectable={canDeleteSegments}
                getRowId={(row) => row.id}
                pagination={{ page, pageSize, total, onPageChange: handlePageChange }}
                bulkActions={canDeleteSegments ? ((rows, deselectRows) => (
                    <Button variant="destructive" size="xs" onClick={() => requestDelete(rows, deselectRows)}>
                        <Trash className="size-3.5" />
                        Delete selected
                    </Button>
                )) : undefined}
                emptyMessage={search ? "No matching segments" : "No segments yet"}
                emptyDescription={search ? "Try a different search term." : "Group contacts by what they bought, asked about or when they last chatted."}
                emptyState={isLoading ? (
                    <TableSkeleton columns={4} showHeader={false} />
                ) : undefined}
                headerActions={
                    <div className="flex items-center gap-2.5">
                        <SearchField onSearchChange={handleSearchChange} />
                        {canCreateSegments && (
                            <Button variant="primary" onClick={() => setIsAddOpen(true)}>
                                <Plus className="size-4" />
                                New segment
                            </Button>
                        )}
                    </div>
                }
                rowActions={(row) => (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => downloadSegment(row.id).catch(() => undefined)} aria-label={`Download ${row.name} as CSV`} title="Download CSV">
                            <Download className="size-4" />
                        </Button>
                        {canDeleteSegments && (
                            <Button variant="ghost" size="icon" className="size-8 hover:text-danger" onClick={() => requestDelete([row])} aria-label={`Delete ${row.name}`} title="Delete">
                                <Trash className="size-4" />
                            </Button>
                        )}
                    </div>
                )}
                className="w-full md:[&_th:nth-child(2)]:pl-0 md:[&_td:first-child:has([role=checkbox])+td]:pl-0"
            />
            <AddSegment open={isAddOpen} onOpenChange={handleAddModalChange} />
            <DeleteContacts
                kind="segment"
                open={isDeleteOpen}
                onOpenChange={handleDeleteModalChange}
                rows={deleteRequest?.rows ?? []}
                onDeleted={deleteRequest?.onDeleted}
            />
        </>
    )
}
