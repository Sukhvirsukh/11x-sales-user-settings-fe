import { Banner } from "@/components/design/Banner";
import Modal from "@/components/design/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRole } from "./roleHistoryApi";
import { roleHistoryQueryKey } from "./roleHistoryQuery";
import { toast } from "@/components/ui/toast";

interface DeleteRoleProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Record<string, unknown> | null
}


export default function DeleteRole({ open, onOpenChange, role }: DeleteRoleProps) {
    const queryClient = useQueryClient();
    const deleteRoleMutation = useMutation({
        mutationFn: () => {
            const id = typeof role?.id === "string" ? role.id : undefined;
            if (!id) throw new Error("The selected role does not have an ID.");
            return deleteRole(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: roleHistoryQueryKey });
            onOpenChange(false);
            toast.add({
                type: "success",
                title: "Role deleted",
                description: "The role has been deleted successfully.",
            })
        },
    });

    function confirmDelete() {
        deleteRoleMutation.mutate();
    }
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Delete role"
            primaryAction={{
                label: "Delete",
                onClick: confirmDelete,
                disabled: deleteRoleMutation.isPending || !role,
            }}
            closeAction={{ label: "Cancel", disabled: false }}
        >
            <Banner variant="destructive">
                <p>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">{role?.name || 'this role'}</span>? This action cannot be undone.
                </p>
            </Banner>
        </Modal>
    )
}
