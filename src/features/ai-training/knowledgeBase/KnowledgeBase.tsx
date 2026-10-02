import { useState } from "react";
import { Plus, SquarePen, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CustomTable, { type Column } from "@/components/design/CustomTable";
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons";

import AddKnowledge from "./AddKnowledge";
import { useKnowledgeBaseQuery } from "./useKnowledgeBaseQuery";
import { dateFormater } from "@/lib/utils";
import type { KnowledgeBase } from "./knowledgeBaseTypes";
import DeleteKnowledgeBase from "./DeleteKnowledgeBase";
import KnowledgeBaseFilter from "./KnowledgeBaseFilter";
import { useCan } from "@/features/auth";


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

    const canCreateKnowledge = useCan("aiTraining.create");
    const canDeleteKnowledge = useCan("aiTraining.delete");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editData, setEditData] = useState<KnowledgeBase | null>(null);
    const [deleteRequest, setDeleteRequest] = useState<{
        knowledges: KnowledgeBase[];
        onDeleted?: (ids: string[]) => void;
    } | null>(null);
    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, hasFilters } = useKnowledgeBaseQuery();
    const items = data?.pages.flatMap((page) => page.items) ?? [];

    const onEdit = (knowledge: KnowledgeBase) => {
        setIsAddModalOpen(true);
        setEditData(knowledge);
    }

    const onDelete = (knowledges: KnowledgeBase[], onDeleted?: (ids: string[]) => void) => {
        setDeleteRequest({ knowledges, onDeleted });
    }

    function handleModalOpenChange(open: boolean) {
        setIsAddModalOpen(open)
        if (!open) setEditData(null)
    }

    return (
        <>
            <CustomTable
                title={`Knowledge base (${data?.pages[0]?.totalCount ?? 0})`}
                columns={columns}
                data={items}
                infiniteScroll={{
                    onLoadMore: () => { void fetchNextPage() },
                    hasMore: Boolean(hasNextPage),
                    isFetching: isFetchingNextPage,
                }}
                emptyState={isLoading ? <TableSkeleton columns={6} showHeader={false} /> : undefined}
                emptyMessage={hasFilters ? "No matching knowledge found" : undefined}
                emptyDescription={hasFilters ? "Try a different search term or filter." : undefined}
                selectable={canDeleteKnowledge}
                getRowId={(row) => String(row.id)}
                bulkActions={canDeleteKnowledge ? ((rows, deselectRows) => (
                    <Button variant="destructive" size="xs"
                        onClick={() => onDelete(rows, deselectRows)}
                    >
                        <Trash className="size-3.5" />
                        Delete selected
                    </Button>
                )) : undefined}
                headerActions={
                    <div className="flex items-center gap-2.5">
                        <KnowledgeBaseFilter />
                        {canCreateKnowledge && (
                            <Button
                                variant="primary"
                                onClick={() => setIsAddModalOpen(true)}
                            >
                                Add knowledge
                                <Plus className="md:ml-2 ml-0.5 md:size-4 size-2" />
                            </Button>
                        )}
                    </div>
                }
                rowActions={canCreateKnowledge || canDeleteKnowledge ? (row) => (
                    <div className="flex items-center gap-2">
                        {canCreateKnowledge && (
                            <Button
                                variant="bare"
                                size="sm"
                                onClick={() => onEdit(row)}
                                aria-label="Edit knowledge"
                            >
                                <SquarePen className="size-4 text-content-muted" />
                            </Button>
                        )}
                        {canDeleteKnowledge && (
                            <Button
                                variant="bare"
                                size="sm"
                                onClick={() => onDelete([row])}
                                aria-label="Delete knowledge"
                            >
                                <Trash className="size-4 text-content-muted" />
                            </Button>
                        )}
                    </div>
                ) : undefined}
                className="w-full md:[&_th:nth-child(2)]:pl-0 md:[&_td:first-child:has([role=checkbox])+td]:pl-0"
            />
            {canCreateKnowledge && <AddKnowledge
                isOpen={isAddModalOpen}
                handleModalOpenChange={handleModalOpenChange}
                data={editData}
            />}
            {canDeleteKnowledge && <DeleteKnowledgeBase
                open={deleteRequest !== null}
                onOpenChange={(open) => {
                    if (!open) setDeleteRequest(null)
                }}
                knowledges={deleteRequest?.knowledges ?? []}
                onDeleted={deleteRequest?.onDeleted}
            />}
        </>
    )
}
