import type { Column } from "@/components/design/CustomTable"
import CustomTable from "@/components/design/CustomTable"
import SearchField from "@/components/shared/SearchField"
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCan } from "@/features/auth"
import { dateFormater, debounce } from "@/lib/utils"
import { Download, Plus, Trash } from "lucide-react"
import { useRef, useState } from "react"
import { useSearchParams } from "react-router"
import DeleteContacts from "./DeleteContacts"
import { useSegmentsQuery } from "./contactQuery"
import type { Segment } from "./contactType"
import AddSegment from "./AddSegment"


const columns: Column[] = [
    { key: "name", header: "Name", width: "280px" },
    {
        key: "status",
        header: "Status",
        align: "center",
        render: (value) => {
            const status = String(value)
            return (
                <Badge variant={status ? "default" : "destructive"}>
                    {status ? "Active" : "Inactive"}
                </Badge>
            )
        },
    },
    {
        key: "createdAt",
        header: "Created date",
        align: "right",
        render: (value) => {
            return dateFormater(value as Date)
        }
    },
    { key: "activeUsers", header: "Active Users", align: "right" },
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
                title="All segaments"
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
