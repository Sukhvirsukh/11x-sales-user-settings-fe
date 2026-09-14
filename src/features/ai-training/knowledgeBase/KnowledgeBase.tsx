import { useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { Plus, SquarePen, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CustomTable, { type Column } from "@/components/design/CustomTable";
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons";

import AddKnowledge from "./AddKnowledge";
import { useKnowledgeBaseQuery } from "./useKnowledgeBaseQuery";
import { dateFormater, debounce } from "@/lib/utils";
import type { KnowledgeBase } from "./knowledgeBaseTypes";
import DeleteKnowledgeBase from "./DeleteKnowledgeBase";
import SearchField from "@/components/shared/SearchField";


function toDateValue(value: unknown): string | Date | null {
    return value instanceof Date || typeof value === "string" ? value : null;
}


const columns: Column[] = [
    {
        key: "name", header: "Name", width: "280px",
        render: (value, row) => {
            const url = typeof row.url === "string" ? row.url : "";
            const name = String(value ?? "").trim();
            const label = name || url
            return url ? (
                <a
                    href={url}
                    title={label}
                    target="_blank"
                    className="block max-w-full truncate text-primary hover:underline"
                >
                    {label}
                </a>
            ) : (
                <span title={label} className="block max-w-full truncate">
                    {label}
                </span>
            );
        },
    },
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
    { key: "createdAt", header: "Create date", render: (value) => dateFormater(toDateValue(value)) },
    { key: "lastRefreshAt", header: "Last refresh", align: "right", render: (value) => dateFormater(toDateValue(value)) },
    { key: "format", header: "Format", align: "right" },
]


export function KnowledgeBase() {

    const [searchParams, setSearchParams] = useSearchParams();
    const setSearchParamsRef = useRef(setSearchParams);
    setSearchParamsRef.current = setSearchParams;
    const search = searchParams.get("search") ?? "";
    const pageParam = Number(searchParams.get("page"));
    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editData, setEditData] = useState<KnowledgeBase | null>(null);
    const [deleteRequest, setDeleteRequest] = useState<{
        knowledges: KnowledgeBase[];
        onDeleted?: (ids: string[]) => void;
    } | null>(null);
    const { data, isLoading, error } = useKnowledgeBaseQuery(page, search.trim());
    const items = data?.items ?? [];
    const total = data?.total ?? 0;
    const pageSize = data?.pageSize ?? 10;

    const handleSearchChange = useRef(
        debounce((value: string) => {
            setSearchParamsRef.current((currentParams) => {
                const nextParams = new URLSearchParams(currentParams);
                if (value) nextParams.set("search", value);
                else nextParams.delete("search");
                nextParams.delete("page");
                return nextParams;
            }, { replace: true });
        }),
    ).current;

    const handlePageChange = (nextPage: number) => {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams);

            if (nextPage === 1) {
                nextParams.delete("page");
            } else {
                nextParams.set("page", String(nextPage));
            }

            return nextParams;
        });
    };

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
                pagination={{ page, pageSize, total, onPageChange: handlePageChange }}
                emptyState={isLoading ? <TableSkeleton columns={6} showHeader={false} /> : undefined}
                emptyMessage={search.trim() ? "No matching knowledge found" : undefined}
                emptyDescription={search.trim() ? "Try a different search term." : undefined}
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
                        {/* Search Field */}
                        <SearchField
                            onSearchChange={handleSearchChange}
                        />
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
