import CustomTable, { type Column } from "@/components/design/CustomTable"
import { InputField } from "@/components/design/InputField"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ListFilter, Plus, Search, SquarePen, Trash } from "lucide-react"
import AddRoleForm from "./AddRoleForm"
import { useRoleHistoryQuery } from "./roleHistoryQuery"
import { Spinner } from "@/components/ui/spinner"
import { useState } from "react"

const columns: Column[] = [
    {
        key: "select",
        header: "",
        width: "56px",
        render: (_, row) => <Checkbox aria-label={`Select ${row.name}`} />,
    },
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

    if (error) throw error

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

    return (
        <>
            <CustomTable
                title="Role history"
                columns={columns}
                data={data}
                emptyMessage={isLoading ? "Loading role history" : "No role history found"}
                emptyDescription={isLoading ? "" : "Roles assigned to your team will appear here."}
                emptyState={isLoading ? (
                    <div className="flex w-full items-center justify-center py-16">
                        <Spinner className="size-6 text-primary" />
                    </div>
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
                                />
                            </PopoverContent>
                        </Popover>
                        <div className="hidden w-full max-w-[231px] md:block">
                            <InputField
                                placeholder="Search"
                                startIcon={<Search className="size-4" />}
                                endIcon={
                                    <ListFilter className="size-4" />
                                }
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
                        <Button variant="bare" size="sm">
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
        </>
    )
}
