import { useMemo, useState } from "react"
import { ListFilter, Plus, Search, SquarePen, Trash } from "lucide-react"

import CustomTable, { type Column } from "@/components/design/CustomTable"
import { InputField } from "@/components/design/InputField"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import AddRoleForm from "./AddRoleForm"
import { useRoleHistoryQuery } from "./roleHistoryQuery"
import DeleteRole from "./DeleteRole"
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons"

const columns: Column[] = [
    { key: "name", header: "Name", width: "280px" },
    { key: "email", header: "Mail Id" },
    { key: "role", header: "Role" },
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
    { key: "startDate", header: "Start date", align: "right" },
]

export default function RoleHistory() {
    const { data = [], isLoading, error } = useRoleHistoryQuery()
    const [editData, setEditData] = useState<Record<string, unknown> | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [deleteRequest, setDeleteRequest] = useState<{
        roles: Record<string, unknown>[]
        onDeleted?: (ids: string[]) => void
    } | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [search, setSearch] = useState("")

    if (error) throw error

    const filteredData = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return data

        return data.filter((row) =>
            ["name", "email", "role"].some((key) =>
                String(row[key] ?? "").toLowerCase().includes(query)
            )
        )
    }, [data, search])

    function openCreateRole() {
        setEditData(null)
        setIsOpen(true)
    }

    function openEditRole(role: Record<string, unknown>) {
        setEditData(role)
        setIsOpen(true)
    }

    function handleModalOpenChange(open: boolean) {
        setIsOpen(open)
        if (!open) setEditData(null)
    }

    function handleDeleteModalChange(open: boolean) {
        setIsDeleteOpen(open)
        if (!open) setDeleteRequest(null)
    }

    function requestDelete(roles: Record<string, unknown>[], onDeleted?: (ids: string[]) => void) {
        setDeleteRequest({ roles, onDeleted })
        setIsDeleteOpen(true)
    }

    return (
        <>
            <CustomTable
                title="Role history"
                columns={columns}
                data={filteredData}
                selectable
                getRowId={(row) => String(row.id)}
                bulkActions={(rows, deselectRows) => (
                    <Button variant="destructive" size="xs" onClick={() => requestDelete(rows, deselectRows)}>
                        <Trash className="size-3.5" />
                        Delete selected
                    </Button>
                )}
                emptyMessage={search ? "No matching roles found" : "No role history found"}
                emptyDescription={search ? "Try a different search term." : "Roles assigned to your team will appear here."}
                emptyState={isLoading ? (
                    <TableSkeleton columns={3} showHeader={false} />
                ) : undefined}
                headerActions={
                    <div className="flex items-center gap-2.5">
                        <Popover>
                            <PopoverTrigger
                                render={
                                    <Button variant="ghost" size="sm" className="size-[35px] md:hidden" aria-label="Search role history">
                                        <Search className="size-4" />
                                    </Button>
                                }
                            />
                            <PopoverContent side="top" align="end" sideOffset={8} className="w-[255px] max-w-[calc(100vw-2rem)] rounded-[10px] border border-blue-200 bg-white! p-3 shadow-blue ring-0! md:hidden">
                                <InputField
                                    aria-label="Search role history"
                                    placeholder="Search"
                                    startIcon={<Search className="size-4" />}
                                    endIcon={<ListFilter className="size-4" />}
                                    variant="light"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </PopoverContent>
                        </Popover>
                        <div className="hidden w-full max-w-[231px] md:block">
                            <InputField
                                aria-label="Search role history"
                                placeholder="Search"
                                startIcon={<Search className="size-4" />}
                                endIcon={
                                    <ListFilter className="size-4" />
                                }
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="primary" size="sm" onClick={openCreateRole}>
                            Add role
                            <Plus className="ml-0.5 size-2 md:ml-2 md:size-4" />
                        </Button>
                    </div>
                }
                rowActions={(row) => (
                    <div className="flex items-center gap-2">
                        <Button variant="bare" size="sm" onClick={() => openEditRole(row)}>
                            <SquarePen className="size-4 text-gray" />
                        </Button>
                        <Button variant="bare" size="sm" onClick={() => requestDelete([row])}>
                            <Trash className="size-4 text-gray" />
                        </Button>
                    </div>
                )}
                className="w-full md:[&_th:nth-child(2)]:pl-0 md:[&_td:first-child:has([role=checkbox])+td]:pl-0"
            />
            <AddRoleForm
                open={isOpen}
                onOpenChange={handleModalOpenChange}
                role={editData}
            />
            <DeleteRole
                open={isDeleteOpen}
                onOpenChange={handleDeleteModalChange}
                roles={deleteRequest?.roles ?? []}
                onDeleted={deleteRequest?.onDeleted}
            />

        </>
    )
}
