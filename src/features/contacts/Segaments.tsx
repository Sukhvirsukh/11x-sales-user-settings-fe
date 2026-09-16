import type { Column } from "@/components/design/CustomTable"
import CustomTable from "@/components/design/CustomTable"
import SearchField from "@/components/shared/SearchField"
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Plus, Trash } from "lucide-react"
import { useMemo, useState } from "react"
import AddSegament from "./AddSegament"
import DeleteContacts from "./DeleteContacts"
import { useSegamentsQuery } from "./contactQuery"
import type { Segament } from "./contactType"


const columns: Column[] = [
    { key: "name", header: "Name", width: "280px" },
    {
        key: "status",
        header: "Status",
        align: "center",
        render: (value) => {
            const status = String(value)
            return (
                <Badge variant={status === "Active" ? "default" : "destructive"}>
                    {status}
                </Badge>
            )
        },
    },
    { key: "createdAt", header: "Created date", align: "right" },
    { key: "activeUsers", header: "Active Users", align: "right" },
]

/** Every displayed column is searchable. */
const searchKeys = columns.map((column) => column.key)

export default function Segaments() {
    const { data = [], isLoading, error } = useSegamentsQuery()
    const [search, setSearch] = useState("")
    const [deleteRequest, setDeleteRequest] = useState<{
        rows: Segament[]
        onDeleted?: (ids: string[]) => void
    } | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)

    if (error) throw error

    const filteredData = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return data

        return data.filter((row) =>
            searchKeys.some((key) =>
                String(row[key as keyof Segament] ?? "").toLowerCase().includes(query)
            )
        )
    }, [data, search])

    function handleDeleteModalChange(open: boolean) {
        setIsDeleteOpen(open)
        if (!open) setDeleteRequest(null)
    }

    function requestDelete(rows: Segament[], onDeleted?: (ids: string[]) => void) {
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
                data={filteredData}
                selectable
                getRowId={(row) => row.id}
                bulkActions={(rows, deselectRows) => (
                    <Button variant="destructive" size="xs" onClick={() => requestDelete(rows, deselectRows)}>
                        <Trash className="size-3.5" />
                        Delete selected
                    </Button>
                )}
                emptyMessage={search ? "No matching segaments found" : "No segaments found"}
                emptyDescription={search ? "Try a different search term." : "Segaments you create will appear here."}
                emptyState={isLoading ? (
                    <TableSkeleton columns={4} showHeader={false} />
                ) : undefined}
                headerActions={
                    <div className="flex items-center gap-2.5">
                        <SearchField onSearchChange={setSearch} />
                        <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
                            Add segament
                            <Plus className="ml-0.5 size-2 md:ml-2 md:size-4" />
                        </Button>
                    </div>
                }
                rowActions={(row) => (
                    <div className="flex items-center gap-2">
                        <Button variant="bare" size="sm" onClick={() => { }}>
                            <Download className="size-4 text-gray" />
                        </Button>
                        <Button variant="bare" size="sm" onClick={() => requestDelete([row])}>
                            <Trash className="size-4 text-gray" />
                        </Button>
                    </div>
                )}
                className="w-full md:[&_th:nth-child(2)]:pl-0 md:[&_td:first-child:has([role=checkbox])+td]:pl-0"
            />
            <AddSegament open={isAddOpen} onOpenChange={handleAddModalChange} />
            <DeleteContacts
                kind="segament"
                open={isDeleteOpen}
                onOpenChange={handleDeleteModalChange}
                rows={deleteRequest?.rows ?? []}
                onDeleted={deleteRequest?.onDeleted}
            />
        </>
    )
}
