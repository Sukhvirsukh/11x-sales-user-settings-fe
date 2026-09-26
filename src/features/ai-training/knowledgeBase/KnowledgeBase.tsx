import { useState } from "react";
import { useSearchParams } from "react-router";
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
import SearchField from "@/components/shared/SearchField";
import { useCan } from "@/features/auth";
import { useDebounce } from "@/hooks/useDebounce";


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
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") ?? "";
    const [pagination, setPagination] = useState<{
        cursor?: string;
        previous: (string | undefined)[];
    }>({ previous: [] });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editData, setEditData] = useState<KnowledgeBase | null>(null);
    const [deleteRequest, setDeleteRequest] = useState<{
        knowledges: KnowledgeBase[];
        onDeleted?: (ids: string[]) => void;
    } | null>(null);
    const { data, isLoading, isPlaceholderData, error } = useKnowledgeBaseQuery(search.trim(), pagination.cursor);
    const items = data?.items ?? [];

    const handleSearchChange = useDebounce((value: string) => {
        setPagination({ previous: [] });
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams);
            if (value) nextParams.set("search", value);
            else nextParams.delete("search");
            nextParams.delete("page");
            nextParams.delete("cursor");
            return nextParams;
        }, { replace: true });
    });

    function goToPrevious() {
        setPagination((current) => {
            if (current.previous.length === 0) return current;
            return {
                cursor: current.previous.at(-1),
                previous: current.previous.slice(0, -1),
            };
        });
    }

    function goToNext() {
        if (!data?.hasMore || !data.nextCursor || isPlaceholderData) return;
        setPagination(({ cursor, previous }) => ({
            cursor: data.nextCursor ?? undefined,
            previous: [...previous, cursor],
        }));
    }

    if (error) return <div>Error: {error.message}</div>

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
                title="Knowledge base"
                columns={columns}
                data={items}
                cursorPagination={{
                    hasPrevious: pagination.previous.length > 0,
                    hasNext: Boolean(data?.hasMore && data.nextCursor && !isPlaceholderData),
                    onPrevious: goToPrevious,
                    onNext: goToNext,
                }}
                emptyState={isLoading ? <TableSkeleton columns={6} showHeader={false} /> : undefined}
                emptyMessage={search.trim() ? "No matching knowledge found" : undefined}
                emptyDescription={search.trim() ? "Try a different search term." : undefined}
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
                        <SearchField onSearchChange={handleSearchChange} />
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
