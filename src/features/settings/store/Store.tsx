import type { Column } from "@/components/design/CustomTable";
import CustomTable from "@/components/design/CustomTable";
import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash } from "lucide-react";
import AddStore from "./AddStore";
import DeleteStore from "./DeleteStore";
import { Badge } from "@/components/ui/badge";
import { useStoreQuery } from "./storeQuery";
import { useMemo, useState } from "react";
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons";
import SearchField from "@/components/shared/SearchField";
import { useCan } from "@/features/auth";

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
    const { data = [], isLoading, error } = useStoreQuery();
    // Create implies edit, so adding and editing a store share one grant — only
    // delete is asked for separately.
    const canCreateStore = useCan("settings.store.create");
    const canDeleteStore = useCan("settings.store.delete");
    const [search, setSearch] = useState("");
    const [editStore, setEditStore] = useState<Record<string, unknown> | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [deleteRequest, setDeleteRequest] = useState<{
        stores: Record<string, unknown>[];
        onDeleted?: (ids: string[]) => void;
    } | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    if (error) throw error;

    const filteredData = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return data;

        return data.filter((row) =>
            ["name", "url", "owner"].some((key) =>
                String(row[key] ?? "").toLowerCase().includes(query),
            ),
        );
    }, [data, search]);

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

    function handleDeleteModalChange(open: boolean) {
        setIsDeleteOpen(open);
        if (!open) setDeleteRequest(null);
    }

    function requestDelete(stores: Record<string, unknown>[], onDeleted?: (ids: string[]) => void) {
        setDeleteRequest({ stores, onDeleted });
        setIsDeleteOpen(true);
    }

    return (
        <>
            <CustomTable
                title="Store"
                columns={columns}
                data={filteredData}
                selectable={canDeleteStore}
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
                        <SearchField onSearchChange={setSearch} />
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
                                <SquarePen className="size-3 text-content-muted" />
                            </Button>
                        )}
                        {canDeleteStore && (
                            <Button variant="bare" size="sm" onClick={() => requestDelete([row])} aria-label="Delete store">
                                <Trash className="size-3 text-content-muted" />
                            </Button>
                        )}
                    </div>
                )) : undefined}
                className="w-full"
            />
            <AddStore
                open={isOpen}
                onOpenChange={handleModalOpenChange}
                store={editStore}
            />
            <DeleteStore
                open={isDeleteOpen}
                onOpenChange={handleDeleteModalChange}
                stores={deleteRequest?.stores ?? []}
                onDeleted={deleteRequest?.onDeleted}
            />
        </>

    );
}
