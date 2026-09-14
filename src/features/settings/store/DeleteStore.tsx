import { Banner } from "@/components/design/Banner";
import Modal from "@/components/design/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStore, deleteStores } from "./storeApi";
import { storeQueryKey } from "./storeQuery";
import { toast } from "@/components/ui/toast";

interface DeleteStoreProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    stores: Record<string, unknown>[];
    onDeleted?: (ids: string[]) => void;
}

export default function DeleteStore({ open, onOpenChange, stores, onDeleted }: DeleteStoreProps) {
    const queryClient = useQueryClient();
    const deleteStoreMutation = useMutation({
        mutationFn: async () => {
            const ids = stores.map((store) => {
                if (typeof store.id !== "string" || !store.id) {
                    throw new Error("A selected store does not have an ID.");
                }
                return store.id;
            });
            if (ids.length === 1) {
                await deleteStore(ids[0]);
            } else {
                await deleteStores(ids);
            }
            return ids;
        },
        onSuccess: async (deletedIds) => {
            onOpenChange(false);
            onDeleted?.(deletedIds);
            toast.add({
                type: "success",
                title: deletedIds.length === 1 ? "Store deleted" : "Stores deleted",
                description: `${deletedIds.length} ${deletedIds.length === 1 ? "store has" : "stores have"} been deleted successfully.`,
            });
            await queryClient.invalidateQueries({ queryKey: storeQueryKey });
        }
    });

    function confirmDelete() {
        deleteStoreMutation.mutate();
    }

    return (
        <Modal
            open={open}
            onOpenChange={(nextOpen) => {
                if (!deleteStoreMutation.isPending) onOpenChange(nextOpen);
            }}
            title={stores.length === 1 ? "Delete store" : "Delete stores"}
            primaryAction={{
                label: deleteStoreMutation.isPending ? "Deleting..." : "Delete",
                onClick: confirmDelete,
                disabled: deleteStoreMutation.isPending || stores.length === 0,
                variant: "destructive",
            }}
            closeAction={{ label: "Cancel", disabled: deleteStoreMutation.isPending }}
        >
            <Banner variant="destructive" isIcon>
                <p>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">
                        {stores.length === 1 ? String(stores[0].storeName ?? "this store") : `${stores.length} selected stores`}
                    </span>? This action cannot be undone.
                </p>
            </Banner>
        </Modal>
    );
}
