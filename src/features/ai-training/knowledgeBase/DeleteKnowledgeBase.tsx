import { Banner } from "@/components/design/Banner";
import Modal from "@/components/design/Modal";
import { toast } from "@/components/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteKnowledgeBase } from "./knowledgeBaseApi";
import { knowledgeBaseQueryKey } from "./useKnowledgeBaseQuery";
import type { KnowledgeBase } from "./knowledgeBaseTypes";

interface DeleteKnowledgeBaseProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    knowledges: KnowledgeBase[];
    onDeleted?: (ids: string[]) => void;
}

export default function DeleteKnowledgeBase({ open, onOpenChange, knowledges, onDeleted }: DeleteKnowledgeBaseProps) {
    const queryClient = useQueryClient();
    const deleteKnowledgeMutation = useMutation({
        mutationFn: async () => {
            const ids = knowledges.map((knowledge) => {
                if (typeof knowledge.id !== "string" || !knowledge.id) {
                    throw new Error("A selected knowledge entry does not have an ID.");
                }
                return knowledge.id;
            });
            await deleteKnowledgeBase(ids);
            return ids;
        },
        onSuccess: async (deletedIds) => {
            onOpenChange(false);
            onDeleted?.(deletedIds);
            toast.add({
                type: "success",
                title: deletedIds.length === 1 ? "Knowledge deleted" : "Knowledge entries deleted",
                description: `${deletedIds.length} ${deletedIds.length === 1 ? "knowledge entry has" : "knowledge entries have"} been deleted successfully.`,
            });
            await queryClient.invalidateQueries({ queryKey: knowledgeBaseQueryKey });
        },
        onError: (error) => {
            toast.add({
                type: "error",
                title: "Unable to delete knowledge",
                description: error.message,
            });
        },
    });

    function confirmDelete() {
        deleteKnowledgeMutation.mutate();
    }
    return (
        <Modal
            open={open}
            onOpenChange={(nextOpen) => {
                if (!deleteKnowledgeMutation.isPending) onOpenChange(nextOpen);
            }}
            title={knowledges.length === 1 ? "Delete knowledge" : "Delete knowledge entries"}
            primaryAction={{
                label: deleteKnowledgeMutation.isPending ? "Deleting..." : "Delete",
                onClick: confirmDelete,
                disabled: deleteKnowledgeMutation.isPending || knowledges.length === 0,
                variant: "destructive",
            }}
            closeAction={{ label: "Cancel", disabled: deleteKnowledgeMutation.isPending }}
        >
            <Banner variant="destructive" isIcon>
                <p>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">
                        {knowledges.length === 1 ? String(knowledges[0].name ?? "this knowledge entry") : `${knowledges.length} selected knowledge entries`}
                    </span>? This action cannot be undone.
                </p>
            </Banner>
        </Modal>
    )
}
