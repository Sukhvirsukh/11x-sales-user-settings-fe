import { useMutation, useQueryClient } from "@tanstack/react-query";

import InfoModal from "@/components/shared/InfoModal";
import { toast } from "@/components/ui/toast";

import { deleteCorrections } from "./correctionsApi";
import { correctionsQueryKey } from "./correctionsQuery";
import type { Correction } from "./correctionTypes";

interface DeleteCorrectionsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    rows: Correction[];
    onDeleted?: (ids: string[]) => void;
}

export default function DeleteCorrections({
    open,
    onOpenChange,
    rows,
    onDeleted,
}: DeleteCorrectionsProps) {
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: async () => {
            const ids = rows.map((row) => {
                if (!row.id) throw new Error("A selected correction does not have an ID.");
                return row.id;
            });
            await deleteCorrections(ids);
            return ids;
        },
        onSuccess: async (deletedIds) => {
            onOpenChange(false);
            onDeleted?.(deletedIds);
            toast.add({
                type: "success",
                title: deletedIds.length === 1 ? "Correction deleted" : "Corrections deleted",
                description: `${deletedIds.length} ${deletedIds.length === 1 ? "correction has" : "corrections have"} been deleted successfully.`,
            });
            await queryClient.invalidateQueries({ queryKey: correctionsQueryKey });
        },
        onError: (error) => {
            toast.add({
                type: "error",
                title: "Unable to delete correction",
                description: error.message,
            });
        },
    });

    return (
        <InfoModal
            variant="warning"
            open={open}
            onOpenChange={(nextOpen) => {
                if (!deleteMutation.isPending) onOpenChange(nextOpen);
            }}
            title={rows.length === 1 ? "Delete correction" : "Delete corrections"}
            description={
                <p>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">
                        {rows.length === 1 ? rows[0].name : `${rows.length} selected corrections`}
                    </span>? This action cannot be undone.
                </p>
            }
            confirmLabel={deleteMutation.isPending ? "Deleting..." : "Delete"}
            cancelLabel="Cancel"
            confirmDisabled={deleteMutation.isPending || rows.length === 0}
            cancelDisabled={deleteMutation.isPending}
            onConfirm={() => deleteMutation.mutate()}
        />
    );
}
