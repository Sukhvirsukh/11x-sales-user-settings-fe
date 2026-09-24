import InfoModal from "@/components/shared/InfoModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRole, deleteRoles } from "./roleHistoryApi";
import { roleHistoryQueryKey } from "./roleHistoryQuery";
import { toast } from "@/components/ui/toast";
import { useCan } from "@/features/auth";
import type { RoleRow } from "./roleHistoryType";

interface DeleteRoleProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roles: RoleRow[];
    onDeleted?: (ids: string[]) => void;
}


export default function DeleteRole({ open, onOpenChange, roles, onDeleted }: DeleteRoleProps) {
    const canDeleteRoles = useCan("settings.roles.delete");
    const queryClient = useQueryClient();
    const deleteRoleMutation = useMutation({
        mutationFn: async () => {
            if (!canDeleteRoles) {
                throw new Error("You do not have permission to delete roles.");
            }
            const ids = roles.map((role) => {
                if (!role.id) {
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
        if (!canDeleteRoles) return;
        deleteRoleMutation.mutate();
    }
    return (
        <InfoModal
            variant="warning"
            open={open && canDeleteRoles}
            onOpenChange={(nextOpen) => {
                if (nextOpen && !canDeleteRoles) return;
                if (!deleteRoleMutation.isPending) onOpenChange(nextOpen);
            }}
            title={roles.length === 1 ? "Delete role" : "Delete roles"}
            description={
                <p>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">
                        {roles.length === 1 ? String(roles[0].name ?? "this role") : `${roles.length} selected roles`}
                    </span>? This action cannot be undone.
                </p>
            }
            confirmLabel={deleteRoleMutation.isPending ? "Deleting..." : "Delete"}
            cancelLabel="Cancel"
            confirmDisabled={deleteRoleMutation.isPending || roles.length === 0 || !canDeleteRoles}
            cancelDisabled={deleteRoleMutation.isPending}
            onConfirm={confirmDelete}
        />
    )
}
