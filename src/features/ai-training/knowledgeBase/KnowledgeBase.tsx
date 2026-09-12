import CustomTable, { type Column } from "@/components/design/CustomTable";
import { InputField } from "@/components/design/InputField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ListFilter, Plus, Search, SquarePen, Trash } from "lucide-react";
import AddKnowledge from "./AddKnowledge";
import { useKnowledgeBaseQuery } from "./useKnowledgeBaseQuery";
import { dateFormater } from "@/lib/utils";
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons";
import { useState } from "react";
import type { KnowledgeBase } from "./knowledgeBaseTypes";
import DeleteKnowledgeBase from "./DeleteKnowledgeBase";


const columns: Column[] = [
    { key: "name", header: "Name", width: "280px" },
    {
        key: "status",
        header: "Status",
        align: "center",
        render: (value) => {
            const status = String(value)
            return (
                <Badge variant={status === "active" ? "default" : "destructive"}>
                    {status?.toUpperCase()}
                </Badge>
            )
        },
    },
    { key: "createdAt", header: "Create date", render: (value) => dateFormater(value) },
    { key: "lastRefreshAt", header: "Last refresh", align: "right", render: (value) => dateFormater(value) },
    { key: "format", header: "Format", align: "right" },
]


export function KnowledgeBase() {

    const [page, setPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editData, setEditData] = useState<KnowledgeBase | null>(null);
    const [deleteRequest, setDeleteRequest] = useState<{
        knowledges: KnowledgeBase[];
        onDeleted?: (ids: string[]) => void;
    } | null>(null);
    const { data, isLoading, error } = useKnowledgeBaseQuery(page);
    const items = data?.items ?? [];
    const total = data?.total ?? 0;
    const pageSize = data?.pageSize ?? 10;

    if (error) return <div>Error: {error.message}</div>

    const onEdit = (knowledge: KnowledgeBase) => {
        setIsAddModalOpen(true);
        setEditData(knowledge);
    }

    const onDelete = (knowledges: KnowledgeBase[], onDeleted?: (ids: string[]) => void) => {
        setIsDeleteModalOpen(true);
        setDeleteRequest({ knowledges, onDeleted });
    }

    function handleModalOpenChange(open: boolean) {
        setIsAddModalOpen(open)
        if (!open) setEditData(null)
    }

    function handleDeleteModalOpenChange(open: boolean) {
        setIsDeleteModalOpen(open)
        if (!open) setDeleteRequest(null)
    }

    return (
        <>
            <CustomTable
                title="Knowledge base"
                columns={columns}
                data={items || []}
                pagination={{ page, pageSize, total, onPageChange: setPage }}
                emptyState={isLoading ? <TableSkeleton columns={6} showHeader={false} /> : undefined}
                selectable
                getRowId={(row) => String(row.id)}
                bulkActions={(rows, deselectRows) => (
                    <Button variant="destructive" size="xs"
                        onClick={() => onDelete(rows, deselectRows)}
                    >
                        <Trash className="size-3.5" />
                        Delete selected
                    </Button>
                )}
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
                        {/* <AddRoleForm /> */}
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Add knowledge
                            <Plus className="md:ml-2 ml-0.5 md:size-4 size-2" />
                        </Button>
                    </div>
                }
                rowActions={(row) => (
                    <div className="flex items-center gap-2">
                        <Button variant="bare" size="sm" onClick={() => onEdit(row)}>
                            <SquarePen className="size-4 text-gray" />
                        </Button>
                        <Button variant="bare" size="sm" onClick={() => onDelete([row])}>
                            <Trash className="size-4 text-gray" />
                        </Button>
                    </div>
                )}
                className="w-full md:[&_th:nth-child(2)]:pl-0 md:[&_td:first-child:has([role=checkbox])+td]:pl-0"
            />
            <AddKnowledge
                isOpen={isAddModalOpen}
                handleModalOpenChange={handleModalOpenChange}
                data={editData}
            />
            <DeleteKnowledgeBase
                open={isDeleteModalOpen}
                onOpenChange={handleDeleteModalOpenChange}
                knowledges={deleteRequest?.knowledges ?? []}
                onDeleted={deleteRequest?.onDeleted}
            />
        </>
    )
}
