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
import type { Segment, SegmentStatusFilter } from "./contactType"
import AddSegment from "./AddSegment"
import SegmentsFilter from "./SegmentsFilter"
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
    const statusParam = searchParams.get("status")?.toLowerCase()
    const appliedStatus: SegmentStatusFilter | null = statusParam === "active" || statusParam === "inactive" ? statusParam : null
    const [draftStatus, setDraftStatus] = useState<SegmentStatusFilter | null>(appliedStatus)
    const [deleteRequest, setDeleteRequest] = useState<{
        rows: Segment[]
        onDeleted?: (ids: string[]) => void
    } | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)

    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useSegmentsQuery(search.trim(), appliedStatus)
    const segments = data?.pages.flatMap((page) => page.items) ?? []

    const handleSearchChange = useDebounce((value: string) => {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)
            if (value) nextParams.set("search", value)
            else nextParams.delete("search")
            return nextParams
        }, { replace: true })
    })

    const applyStatusFilter = () => {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)
            if (draftStatus) nextParams.set("status", draftStatus)
            else nextParams.delete("status")
            return nextParams
        }, { replace: true })
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
                emptyMessage={search || appliedStatus ? "No matching segments found" : "No segments found"}
                emptyDescription={search || appliedStatus ? "Try a different search term or filter." : "Segments you create will appear here."}
                emptyState={isLoading ? (
                    <TableSkeleton columns={4} showHeader={false} />
                ) : undefined}
                headerActions={
                    <div className="flex items-center gap-2.5">
                        <SearchField
                            onSearchChange={handleSearchChange}
                            filterContent={<SegmentsFilter value={draftStatus} onChange={setDraftStatus} />}
                            filterModalProps={{
                                selectedCount: draftStatus ? 1 : 0,
                                onClearAll: () => setDraftStatus(null),
                                onSubmit: applyStatusFilter,
                                onOpenChange: (open) => {
                                    if (open) setDraftStatus(appliedStatus)
                                },
                            }}
                        />
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
