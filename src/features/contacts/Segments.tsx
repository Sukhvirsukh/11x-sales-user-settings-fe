import type { Column } from "@/components/design/CustomTable"
import CustomTable from "@/components/design/CustomTable"
import SearchField from "@/components/shared/SearchField"
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCan } from "@/features/auth"
import { Download, Plus, Trash } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "react-router"
import DeleteContacts from "./DeleteContacts"
import { useSegmentsQuery } from "./contactQuery"
import type { Segment } from "./contactType"
import AddSegment from "./AddSegment"
import { useDebounce } from "@/hooks/useDebounce"
import { dateFormater } from "@/lib/utils"


const columns: Column[] = [
    { key: "name", header: "Name", width: "280px" },
    {
        key: "status",
        header: "Status",
        align: "center",
        render: (value) => (
            <Badge variant={value === "Active" ? "default" : "destructive"}>
                {value === "Active" ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    {
        key:
            "createdAt",
        header: "Created date",
        align: "right",
        render: (value) => {
            return dateFormater(value as Date)
        }
    },
    { key: "activeUsers", header: "Active Users", align: "right" },
]

export default function Segments() {
    const canCreateSegments = useCan("contacts.create")
    const canDeleteSegments = useCan("contacts.delete")
    const [searchParams, setSearchParams] = useSearchParams()
    const search = searchParams.get("search") ?? ""
    const [pagination, setPagination] = useState<{
        cursor?: string
        previous: (string | undefined)[]
    }>({ previous: [] })

    const [deleteRequest, setDeleteRequest] = useState<{
        rows: Segment[]
        onDeleted?: (ids: string[]) => void
    } | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)

    const { data, isLoading, isPlaceholderData, error } = useSegmentsQuery(search.trim(), pagination.cursor)
    const segments = data?.items ?? []

    const handleSearchChange = useDebounce((value: string) => {
        setPagination({ previous: [] })
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)
            if (value) nextParams.set("search", value)
            else nextParams.delete("search")
            nextParams.delete("page")
            nextParams.delete("cursor")
            return nextParams
        }, { replace: true })
    })

    function goToPrevious() {
        setPagination(({ previous }) => {
            if (previous.length === 0) return { previous }
            return { cursor: previous.at(-1), previous: previous.slice(0, -1) }
        })
    }

    function goToNext() {
        if (!data?.hasMore || !data.nextCursor || isPlaceholderData) return
        setPagination(({ cursor, previous }) => ({
            cursor: data.nextCursor ?? undefined,
            previous: [...previous, cursor],
        }))
    }

    function requestDelete(rows: Segment[], onDeleted?: (ids: string[]) => void) {
        setDeleteRequest({ rows, onDeleted })
    }

    if (error) throw error

    return (
        <>
            <CustomTable
                title="All segaments"
                columns={columns}
                data={segments}
                cursorPagination={{
                    hasPrevious: pagination.previous.length > 0,
                    hasNext: Boolean(data?.hasMore && data.nextCursor && !isPlaceholderData),
                    onPrevious: goToPrevious,
                    onNext: goToNext,
                }}
                selectable={canDeleteSegments}
                getRowId={(row) => row.id}
                bulkActions={canDeleteSegments ? ((rows, deselectRows) => (
                    <Button variant="destructive" size="xs" onClick={() => requestDelete(rows, deselectRows)}>
                        <Trash className="size-3.5" />
                        Delete selected
                    </Button>
                )) : undefined}
                emptyMessage={search ? "No matching segaments found" : "No segaments found"}
                emptyDescription={search ? "Try a different search term." : "Segaments you create will appear here."}
                emptyState={isLoading ? (
                    <TableSkeleton columns={4} showHeader={false} />
                ) : undefined}
                headerActions={
                    <div className="flex items-center gap-2.5">
                        <SearchField onSearchChange={handleSearchChange} />
                        {canCreateSegments && (
                            <Button variant="primary" onClick={() => setIsAddOpen(true)}>
                                Add segment
                                <Plus className="ml-0.5 size-2 md:ml-2 md:size-4" />
                            </Button>
                        )}
                    </div>
                }
                rowActions={(row) => (
                    <div className="flex items-center gap-2">
                        <Button variant="bare" size="sm" onClick={() => { }} aria-label="Download segment">
                            <Download className="size-4 text-content-muted" />
                        </Button>
                        {canDeleteSegments && (
                            <Button variant="bare" size="sm" onClick={() => requestDelete([row])} aria-label="Delete segment">
                                <Trash className="size-4 text-content-muted" />
                            </Button>
                        )}
                    </div>
                )}
                className="w-full md:[&_th:nth-child(2)]:pl-0 md:[&_td:first-child:has([role=checkbox])+td]:pl-0"
            />
            <AddSegment open={isAddOpen} onOpenChange={setIsAddOpen} />
            <DeleteContacts
                kind="segment"
                open={deleteRequest !== null}
                onOpenChange={(open) => {
                    if (!open) setDeleteRequest(null)
                }}
                rows={deleteRequest?.rows ?? []}
                onDeleted={deleteRequest?.onDeleted}
            />
        </>
    )
}
