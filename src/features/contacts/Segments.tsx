import type { Column } from "@/components/design/CustomTable"
import CustomTable from "@/components/design/CustomTable"
import SearchField from "@/components/shared/SearchField"
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCan } from "@/features/auth"
import { ChevronLeft, ChevronRight, Download, Plus, Trash } from "lucide-react"
import { useEffect, useRef, useState } from "react"
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
        render: (value) => (
            <Badge variant={value === "Active" ? "default" : "destructive"}>
                {value === "Active" ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    { key: "createdAt", header: "Created date", align: "right" },
    { key: "activeUsers", header: "Active Users", align: "right" },
]

export default function Segments() {
    const canCreateSegments = useCan("contacts.create")
    const canDeleteSegments = useCan("contacts.delete")
    const [searchParams, setSearchParams] = useSearchParams()
    const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const setSearchParamsRef = useRef(setSearchParams)
    useEffect(() => {
        setSearchParamsRef.current = setSearchParams
    }, [setSearchParams])
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

    useEffect(() => () => clearTimeout(searchTimer.current), [])

    function handleSearchChange(value: string) {
        clearTimeout(searchTimer.current)
        searchTimer.current = setTimeout(() => {
            setPagination({ previous: [] })
            setSearchParamsRef.current((currentParams) => {
                const nextParams = new URLSearchParams(currentParams)
                if (value) nextParams.set("search", value)
                else nextParams.delete("search")
                nextParams.delete("page")
                nextParams.delete("cursor")
                return nextParams
            }, { replace: true })
        }, 300)
    }

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

    return (
        <>
            <CustomTable
                title="All segaments"
                columns={columns}
                data={segments}
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
            {(pagination.previous.length > 0 || data?.hasMore) && (
                <nav aria-label="Segments pagination" className="mt-3 flex items-center justify-center gap-2">
                    <Button variant="secondary" size="sm" onClick={goToPrevious} disabled={pagination.previous.length === 0}>
                        <ChevronLeft className="size-4" /> Previous
                    </Button>
                    <Button variant="secondary" size="sm" onClick={goToNext} disabled={!data?.hasMore || !data.nextCursor || isPlaceholderData}>
                        Next <ChevronRight className="size-4" />
                    </Button>
                </nav>
            )}
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
