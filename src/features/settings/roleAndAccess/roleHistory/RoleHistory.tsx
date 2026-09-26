import { useState } from "react"
import { Plus, SquarePen, Trash } from "lucide-react"
import { useSearchParams } from "react-router"

import CustomTable, { type Column } from "@/components/design/CustomTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AddRoleForm from "./AddRoleForm"
import { useRoleHistoryQuery } from "./roleHistoryQuery"
import DeleteRole from "./DeleteRole"
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons"
import SearchField from "@/components/shared/SearchField"
import { useCan } from "@/features/auth"
import { useDebounce } from "@/hooks/useDebounce"
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
            const isActive = value === true || value === "active"
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
    // Create implies edit, so adding and editing a role share one grant — only
    // delete is asked for separately.
    const canCreateRole = useCan("settings.roles.create")
    const canDeleteRole = useCan("settings.roles.delete")
    const [searchParams, setSearchParams] = useSearchParams()
    const search = searchParams.get("search") ?? ""
    const [pagination, setPagination] = useState<{
        cursor?: string
        previous: (string | undefined)[]
    }>({ previous: [] })
    const { data, isLoading, isPlaceholderData, error } = useRoleHistoryQuery(search.trim(), pagination.cursor)
    const roles = data?.items ?? []
    const [editData, setEditData] = useState<RoleRow | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [deleteRequest, setDeleteRequest] = useState<{
        roles: RoleRow[]
        onDeleted?: (ids: string[]) => void
    } | null>(null)

    const selection = canDeleteRole
        ? { selectable: true as const, getRowId: rowId }
        : {}

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
        setPagination((current) => {
            if (current.previous.length === 0) return current
            return {
                cursor: current.previous.at(-1),
                previous: current.previous.slice(0, -1),
            }
        })
    }

    function goToNext() {
        if (!data?.hasMore || !data.nextCursor || isPlaceholderData) return
        setPagination(({ cursor, previous }) => ({
            cursor: data.nextCursor ?? undefined,
            previous: [...previous, cursor],
        }))
    }

    if (error) throw error

    function openCreateRole() {
        if (!canCreateRole) return
        setEditData(null)
        setIsOpen(true)
    }

    function openEditRole(role: RoleRow) {
        if (!canCreateRole) return
        setEditData(role)
        setIsOpen(true)
    }

    function handleModalOpenChange(open: boolean) {
        setIsOpen(open)
        if (!open) setEditData(null)
    }

    function requestDelete(roles: RoleRow[], onDeleted?: (ids: string[]) => void) {
        if (!canDeleteRole) return
        setDeleteRequest({ roles, onDeleted })
    }

    return (
        <>
            <CustomTable
                title="Role history"
                columns={columns}
                data={roles}
                cursorPagination={{
                    hasPrevious: pagination.previous.length > 0,
                    hasNext: Boolean(data?.hasMore && data.nextCursor && !isPlaceholderData),
                    onPrevious: goToPrevious,
                    onNext: goToNext,
                }}
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
                        <SearchField onSearchChange={handleSearchChange} />
                        {canCreateRole && (
                            <Button variant="primary" onClick={openCreateRole}>
                                Add role
                                <Plus className="ml-0.5 size-2 md:ml-2 md:size-3.5" />
                            </Button>
                        )}
                    </div>
                }
                rowActions={canCreateRole || canDeleteRole ? (row) => (
                    <div className="flex items-center gap-2">
                        {canCreateRole && (
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
            {canCreateRole && (
                <AddRoleForm
                    open={isOpen}
                    onOpenChange={handleModalOpenChange}
                    role={editData}
                />
            )}
            {canDeleteRole && (
                <DeleteRole
                    open={deleteRequest !== null}
                    onOpenChange={(open) => {
                        if (!open) setDeleteRequest(null)
                    }}
                    roles={deleteRequest?.roles ?? []}
                    onDeleted={deleteRequest?.onDeleted}
                />
            )}

        </>
    )
}
