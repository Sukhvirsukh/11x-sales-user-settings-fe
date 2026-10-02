import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSegaments, deleteUserProfiles } from "./contactsApi";
import { segmentsQueryKey, userProfilesQueryKey } from "./contactQuery";
import { toast } from "@/components/ui/toast";

export type ContactKind = "segment" | "userProfile";

const CONTACT_LABELS: Record<ContactKind, {
    singular: string;
    plural: string;
    queryKey: readonly unknown[];
    remove: (ids: string[]) => Promise<string[]>;
}> = {
    segment: {
        singular: "segment",
        plural: "segments",
        queryKey: segmentsQueryKey,
        remove: deleteSegaments,
    },
    userProfile: {
        singular: "user profile",
        plural: "user profiles",
        queryKey: userProfilesQueryKey,
        remove: deleteUserProfiles,
    },
};

interface DeleteContactsProps {
    kind: ContactKind;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    rows: Record<string, unknown>[];
    onDeleted?: (ids: string[]) => void;
}

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function DeleteContacts({ kind, open, onOpenChange, rows, onDeleted }: DeleteContactsProps) {
    const queryClient = useQueryClient();
    const { singular, plural, queryKey, remove } = CONTACT_LABELS[kind];

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const ids = rows.map((row) => {
                if (typeof row.id !== "string" || !row.id) {
                    throw new Error(`A selected ${singular} does not have an ID.`);
                }
                return row.id;
            });
            await remove(ids);
            return ids;
        },
        onSuccess: async (deletedIds) => {
            onOpenChange(false);
            onDeleted?.(deletedIds);
            toast.add({
                type: "success",
                title: deletedIds.length === 1
                    ? `${capitalize(singular)} deleted`
                    : `${capitalize(plural)} deleted`,
                description: `${deletedIds.length} ${deletedIds.length === 1
                    ? `${singular} has`
                    : `${plural} have`} been deleted successfully.`,
            });
            await queryClient.invalidateQueries({ queryKey });
        }
    });

    function confirmDelete() {
        deleteMutation.mutate();
    }

    const title = rows.length === 1 ? `Delete ${singular}` : `Delete ${plural}`;
    const description = <>
        Are you sure you want to delete{" "}
        <span className="font-bold">
            {rows.length === 1 ? String(rows[0].name ?? `this ${singular}`) : `${rows.length} selected ${plural}`}
        </span>? This action cannot be undone.
    </>;
    const onModalOpenChange = (nextOpen: boolean) => {
        if (!deleteMutation.isPending) onOpenChange(nextOpen);
    };

    return (
        <ConfirmationModal
            variant="destructive"
            open={open}
            onOpenChange={onModalOpenChange}
            title={title}
            description={description}
            confirmLabel={deleteMutation.isPending ? "Deleting..." : "Delete"}
            confirmDisabled={rows.length === 0}
            isPending={deleteMutation.isPending}
            onConfirm={confirmDelete}
        />
    )
}
