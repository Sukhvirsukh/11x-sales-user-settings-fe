import type { Column } from "@/components/design/CustomTable"
import CustomTable from "@/components/design/CustomTable"
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCan } from "@/features/auth"
import { Download, Plus, Trash } from "lucide-react"
import { useState } from "react"
import DeleteContacts from "./DeleteContacts"
import { useSegmentsQuery } from "./contactQuery"
import type { Segment } from "./contactType"
import AddSegment from "./AddSegment"
import SegmentsFilter from "./SegmentsFilter"
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
    const [deleteRequest, setDeleteRequest] = useState<{
        rows: Segment[]
        onDeleted?: (ids: string[]) => void
    } | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)

    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, hasFilters } = useSegmentsQuery()
    const segments = data?.pages.flatMap((page) => page.items) ?? []

    function requestDelete(rows: Segment[], onDeleted?: (ids: string[]) => void) {
        setDeleteRequest({ rows, onDeleted })
    }

    // if (error) throw error

    return (
        <>
            <CustomTable
                title={`All segaments (${data?.pages[0]?.totalCount ?? 0})`}
                columns={columns}
                data={segments}
                infiniteScroll={{
                    onLoadMore: () => { void fetchNextPage() },
                    hasMore: Boolean(hasNextPage),
                    isFetching: isFetchingNextPage,
                }}
                selectable={canDeleteSegments}
                getRowId={(row) => row.id}
                bulkActions={canDeleteSegments ? ((rows, deselectRows) => (
                    <Button variant="destructive" size="xs" onClick={() => requestDelete(rows, deselectRows)}>
                        <Trash className="size-3.5" />
                        Delete selected
                    </Button>
                )) : undefined}
                emptyMessage={hasFilters ? "No matching segments found" : "No segments found"}
                emptyDescription={hasFilters ? "Try a different search term or filter." : "Segments you create will appear here."}
                emptyState={isLoading ? (
                    <TableSkeleton columns={4} showHeader={false} />
                ) : undefined}
                headerActions={
                    <div className="flex items-center gap-2.5">
                        <SegmentsFilter />
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
