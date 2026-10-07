import { useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { Plus, RotateCw, SquarePen, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CustomTable, { type Column } from "@/components/design/CustomTable";
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons";

import AddKnowledge from "./AddKnowledge";
import { knowledgeBaseQueryKey, useKnowledgeBaseQuery } from "./useKnowledgeBaseQuery";
import { refreshKnowledge } from "./knowledgeBaseApi";
import { queryClient } from "@/lib/queryClient";
import { toast } from "@/components/ui/toast";
import { dateFormater, debounce } from "@/lib/utils";
import type { KnowledgeBase } from "./knowledgeBaseTypes";
import DeleteKnowledgeBase from "./DeleteKnowledgeBase";
import SearchField from "@/components/shared/SearchField";
import { useCan } from "@/features/auth";


function toDateValue(value: unknown): string | Date | null {
    return value instanceof Date || typeof value === "string" ? value : null;
}


const STATUS_BADGE = {
    ready: { label: "Ready", variant: "default" },
    processing: { label: "Processing", variant: "warning" },
    failed: { label: "Failed", variant: "destructive" },
} as const;

const FORMAT_LABEL: Record<string, string> = {
    Link: "Page",
    Website: "Website",
    Sitemap: "Sitemap",
    Pdf: "PDF",
    Doc: "Word",
    Csv: "CSV",
    Text: "Text",
    Store: "Shopify store",
};

const columns: Column[] = [
    {
        key: "name", header: "Name", width: "320px",
        render: (value, row) => {
            const item = row as KnowledgeBase;
            const name = String(value ?? "").trim() || item.url;
            const detail = item.status === "failed" && item.error
                ? item.error
                : (item.format === "Website" || item.format === "Sitemap") && item.pages
                    ? `${item.pages} page${item.pages === 1 ? "" : "s"} read`
                    : item.synced ? "Kept in sync with your store" : "";
            return (
                <span className="flex min-w-0 flex-col">
                    {item.url ? (
                        <a href={item.url} title={item.url} target="_blank" rel="noreferrer" className="truncate font-medium text-foreground hover:underline">
                            {name}
                        </a>
                    ) : (
                        <span title={name} className="truncate font-medium">{name}</span>
                    )}
                    {detail && (
                        <span title={detail} className={`truncate text-sm ${item.status === "failed" ? "text-danger" : "text-muted-foreground"}`}>
                            {detail}
                        </span>
                    )}
                </span>
            );
        },
    },
    {
        key: "status",
        header: "Status",
        render: (value) => {
            const badge = STATUS_BADGE[value as keyof typeof STATUS_BADGE] ?? STATUS_BADGE.processing;
            return <Badge variant={badge.variant}>{badge.label}</Badge>;
        },
    },
    { key: "format", header: "Type", render: (value) => FORMAT_LABEL[String(value)] ?? String(value) },
    { key: "lastRefreshAt", header: "Last updated", align: "right", render: (value) => dateFormater(toDateValue(value)) },
]


export function KnowledgeBase() {

    const canCreateKnowledge = useCan("aiTraining.create");
    const canDeleteKnowledge = useCan("aiTraining.delete");
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
    const refreshMutation = useMutation({
        mutationFn: (item: KnowledgeBase) => refreshKnowledge(item.id),
        onSuccess: async (_result, item) => {
            await queryClient.invalidateQueries({ queryKey: knowledgeBaseQueryKey });
            toast.add({ type: "success", title: "Refreshing", description: `Reading “${item.name}” again.` });
        },
    });
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
                description="What your agent answers from: your website, documents and notes."
                columns={columns}
                data={items || []}
                pagination={{ page, pageSize, total, onPageChange: handlePageChange }}
                emptyState={isLoading ? <TableSkeleton columns={6} showHeader={false} /> : undefined}
                emptyMessage={search.trim() ? "No matching knowledge found" : "Nothing here yet"}
                emptyDescription={search.trim() ? "Try a different search term." : "Add your website first: your agent learns your products, policies and pages from it."}
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
                        {/* Search Field */}
                        <SearchField
                            onSearchChange={handleSearchChange}
                        />
                        {canCreateKnowledge && (
                            <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
                                <Plus className="size-4" />
                                Add knowledge
                            </Button>
                        )}
                    </div>
                }
                rowActions={canCreateKnowledge || canDeleteKnowledge ? (row) => (
                    <div className="flex items-center gap-1">
                        {canCreateKnowledge && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                disabled={row.status === "processing" || (refreshMutation.isPending && refreshMutation.variables?.id === row.id)}
                                onClick={() => refreshMutation.mutate(row)}
                                aria-label={`Refresh ${row.name}`}
                                title="Read again now"
                            >
                                <RotateCw className={`size-4 ${row.status === "processing" ? "animate-spin" : ""}`} />
                            </Button>
                        )}
                        {canCreateKnowledge && !row.synced && (
                            <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit(row)} aria-label={`Edit ${row.name}`} title="Edit">
                                <SquarePen className="size-4" />
                            </Button>
                        )}
                        {canDeleteKnowledge && (
                            <Button variant="ghost" size="icon" className="size-8 hover:text-danger" onClick={() => onDelete([row])} aria-label={`Delete ${row.name}`} title="Delete">
                                <Trash className="size-4" />
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
                open={isDeleteModalOpen}
                onOpenChange={handleDeleteModalOpenChange}
                knowledges={deleteRequest?.knowledges ?? []}
                onDeleted={deleteRequest?.onDeleted}
            />}
        </>
    )
}
