import { useMemo, useState } from "react"
import { Plus, SquarePen, Trash } from "lucide-react"

import CustomTable, { type Column } from "@/components/design/CustomTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AddRoleForm from "./AddRoleForm"
import { useRoleHistoryQuery } from "./roleHistoryQuery"
import DeleteRole from "./DeleteRole"
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons"
import SearchField from "@/components/shared/SearchField"
import { useCan } from "@/features/auth"
import type { RoleRow } from "./roleHistoryType"

const columns: Column[] = [
    { key: "name", header: "Name", width: "280px" },
    { key: "email", header: "Email" },
    {
        key: "role",
        header: "Role"
    },
    {
        key: "status",
        header: "Status",
        align: "center",
        render: (value) => {
            const pending = value === "pending"
            const isActive = value === 'active'
            return (
                <Badge variant={pending ? "warning" : isActive ? "default" : "destructive"}>
                    {pending ? "Pending" : isActive ? "Active" : "Inactive"}
                </Badge>
            )
        },
    },
    { key: "createdAt", header: "Created at", align: "right" },
]

function rowId(row: RoleRow) {
    return String(row.id)
}

export default function RoleHistory() {
    // Each affordance asks for the capability it needs, so the table stays unchanged
    // when the policy moves a permission to another role.
    const canCreateRole = useCan("settings.roles.create")
    const canEditRole = useCan("settings.roles.edit")
    const canDeleteRole = useCan("settings.roles.delete")
    const { data = [], isLoading, error } = useRoleHistoryQuery()
    const [editData, setEditData] = useState<RoleRow | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [deleteRequest, setDeleteRequest] = useState<{
        roles: RoleRow[]
        onDeleted?: (ids: string[]) => void
    } | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [search, setSearch] = useState("")

    const selection = canDeleteRole
        ? { selectable: true as const, getRowId: rowId }
        : {}

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

    function openEditRole(role: RoleRow) {
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

    function requestDelete(roles: RoleRow[], onDeleted?: (ids: string[]) => void) {
        setDeleteRequest({ roles, onDeleted })
        setIsDeleteOpen(true)
    }

    return (
        <>
            <CustomTable
                title="Role history"
                columns={columns}
                data={filteredData}
                mobileColumnSplit={["50%", "50%"]}
                {...selection}
                bulkActions={canDeleteRole ? (rows, deselectRows) => (
                    <Button variant="destructive" size="xs" onClick={() => requestDelete(rows, deselectRows)}>
                        <Trash className="size-3.5" />
                        Delete selected
                    </Button>
                ) : undefined}
                emptyMessage={search ? "No matching roles found" : "No role history found"}
                emptyDescription={search ? "Try a different search term." : "Roles assigned to your team will appear here."}
                emptyState={isLoading ? (
                    <TableSkeleton columns={3} showHeader={false} />
                ) : undefined}
                headerActions={
                    <div className="flex items-center gap-2.5">
                        <SearchField onSearchChange={setSearch} />
                        {canCreateRole && (
                            <Button variant="primary" onClick={openCreateRole}>
                                Add role
                                <Plus className="ml-0.5 size-2 md:ml-2 md:size-3.5" />
                            </Button>
                        )}
                    </div>
                }
                rowActions={canEditRole || canDeleteRole ? (row) => (
                    <div className="flex items-center gap-2">
                        {canEditRole && (
                            <Button variant="bare" size="sm" onClick={() => openEditRole(row)} aria-label="Edit role">
                                <SquarePen className="size-4 text-content-muted" />
                            </Button>
                        )}
                        {canDeleteRole && (
                            <Button variant="bare" size="sm" onClick={() => requestDelete([row])} aria-label="Delete role">
                                <Trash className="size-4 text-content-muted" />
                            </Button>
                        )}
                    </div>
                ) : undefined}
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
