import type { Column } from "@/components/design/CustomTable";
import CustomTable from "@/components/design/CustomTable";
import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash } from "lucide-react";
import AddStore from "./AddStore";
import DeleteStore from "./DeleteStore";
import { Badge } from "@/components/ui/badge";
import { useStoreQuery } from "./storeQuery";
import { useState } from "react";
import { useSearchParams } from "react-router";
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons";
import SearchField from "@/components/shared/SearchField";
import { useCan } from "@/features/auth";
import { useDebounce } from "@/hooks/useDebounce";

const columns: Column[] = [
    { key: "name", header: "Store Name", width: "280px" },
    { key: "url", header: "Store URL" },
    { key: "owner", header: "Store Owner" },
    {
        key: "status",
        header: "Status",
        align: "center",
        render: (value) => {
            const isActive = value === true || String(value).toLowerCase() === "active";
            return (
                <Badge variant={isActive ? "default" : "destructive"}>
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    { key: "startDate", header: "Start date", align: "right" },
];

export function Store() {
    // Create implies edit, so adding and editing a store share one grant — only
    // delete is asked for separately.
    const canCreateStore = useCan("settings.store.create");
    const canDeleteStore = useCan("settings.store.delete");
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") ?? "";
    const [pagination, setPagination] = useState<{
        cursor?: string;
        previous: (string | undefined)[];
    }>({ previous: [] });
    const { data, isLoading, isPlaceholderData, error } = useStoreQuery(search.trim(), pagination.cursor);
    const stores = data?.items ?? [];
    const [editStore, setEditStore] = useState<Record<string, unknown> | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [deleteRequest, setDeleteRequest] = useState<{
        stores: Record<string, unknown>[];
        onDeleted?: (ids: string[]) => void;
    } | null>(null);

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

    if (error) throw error;

    function openCreateStore() {
        setEditStore(null);
        setIsOpen(true);
    }

    function openEditStore(store: Record<string, unknown>) {
        setEditStore(store);
        setIsOpen(true);
    }

    function handleModalOpenChange(open: boolean) {
        setIsOpen(open);
        if (!open) setEditStore(null);
    }

    function requestDelete(stores: Record<string, unknown>[], onDeleted?: (ids: string[]) => void) {
        setDeleteRequest({ stores, onDeleted });
    }

    return (
        <>
            <CustomTable
                title="Store"
                columns={columns}
                data={stores}
                cursorPagination={{
                    hasPrevious: pagination.previous.length > 0,
                    hasNext: Boolean(data?.hasMore && data.nextCursor && !isPlaceholderData),
                    onPrevious: goToPrevious,
                    onNext: goToNext,
                }}
                selectable={canDeleteStore}
                mobileColumnSplit={['40%', '60%']}
                getRowId={(row) => String(row.id)}
                bulkActions={canDeleteStore ? ((rows, deselectRows) => (
                    <Button variant="destructive" size="xs" onClick={() => requestDelete(rows, deselectRows)}>
                        <Trash className="size-3.5" />
                        Delete selected
                    </Button>
                )) : undefined}
                emptyMessage={search ? "No matching stores found" : "No stores found"}
                emptyDescription={search ? "Try a different search term." : "Stores connected to your account will appear here."}
                emptyState={
                    isLoading ? (
                        <TableSkeleton columns={6} rows={4} showHeader={false} />
                    ) : undefined
                }
                headerActions={
                    <div className="flex items-center gap-2.5">
                        <SearchField onSearchChange={handleSearchChange} />
                        {canCreateStore && (
                            <Button variant="primary" onClick={openCreateStore}>
                                Add store
                                <Plus className="ml-0.5 size-2 md:ml-2 md:size-3.5" />
                            </Button>
                        )}
                    </div>
                }
                rowActions={canCreateStore || canDeleteStore ? ((row) => (
                    <div className="flex items-center gap-2">
                        {canCreateStore && (
                            <Button variant="bare" size="sm" onClick={() => openEditStore(row)} aria-label="Edit store">
                                <SquarePen className="size-4 text-content-muted" />
                            </Button>
                        )}
                        {canDeleteStore && (
                            <Button variant="bare" size="sm" onClick={() => requestDelete([row])} aria-label="Delete store">
                                <Trash className="size-4 text-content-muted" />
                            </Button>
                        )}
                    </div>
                )) : undefined}
                className="w-full"
            />
            {canCreateStore && <AddStore
                open={isOpen}
                onOpenChange={handleModalOpenChange}
                store={editStore}
            />}
            {canDeleteStore && <DeleteStore
                open={deleteRequest !== null}
                onOpenChange={(open) => {
                    if (!open) setDeleteRequest(null);
                }}
                stores={deleteRequest?.stores ?? []}
                onDeleted={deleteRequest?.onDeleted}
            />}
        </>

    );
}
