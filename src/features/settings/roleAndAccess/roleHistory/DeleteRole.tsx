import { Banner } from "@/components/design/Banner";
import Modal from "@/components/design/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRole, deleteRoles } from "./roleHistoryApi";
import { roleHistoryQueryKey } from "./roleHistoryQuery";
import { toast } from "@/components/ui/toast";

interface DeleteRoleProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roles: Record<string, unknown>[];
    onDeleted?: (ids: string[]) => void;
}


export default function DeleteRole({ open, onOpenChange, roles, onDeleted }: DeleteRoleProps) {
    const queryClient = useQueryClient();
    const deleteRoleMutation = useMutation({
        mutationFn: async () => {
            const ids = roles.map((role) => {
                if (typeof role.id !== "string" || !role.id) {
                    throw new Error("A selected role does not have an ID.");
                }
                return role.id;
            });
            if (ids.length === 1) {
                await deleteRole(ids[0]);
            } else {
                await deleteRoles(ids);
            }
            return ids;
        },
        onSuccess: async (deletedIds) => {
            onOpenChange(false);
            onDeleted?.(deletedIds);
            toast.add({
                type: "success",
                title: deletedIds.length === 1 ? "Role deleted" : "Roles deleted",
                description: `${deletedIds.length} ${deletedIds.length === 1 ? "role has" : "roles have"} been deleted successfully.`,
            });
            await queryClient.invalidateQueries({ queryKey: roleHistoryQueryKey });
        }
    });

    function confirmDelete() {
        deleteRoleMutation.mutate();
    }
    return (
        <Modal
            open={open}
            onOpenChange={(nextOpen) => {
                if (!deleteRoleMutation.isPending) onOpenChange(nextOpen);
            }}
            title={roles.length === 1 ? "Delete role" : "Delete roles"}
            primaryAction={{
                label: deleteRoleMutation.isPending ? "Deleting..." : "Delete",
                onClick: confirmDelete,
                disabled: deleteRoleMutation.isPending || roles.length === 0,
                variant: "destructive",
            }}
            closeAction={{ label: "Cancel", disabled: deleteRoleMutation.isPending }}
        >
            <Banner variant="destructive" isIcon>
                <p>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">
                        {roles.length === 1 ? String(roles[0].name ?? "this role") : `${roles.length} selected roles`}
                    </span>? This action cannot be undone.
                </p>
            </Banner>
        </Modal>
    )
}
