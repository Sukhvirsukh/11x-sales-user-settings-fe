import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Modal from "@/components/design/Modal";
import { SelectField } from "@/components/design/SelectField";
import { toast } from "@/components/ui/toast";
import { useCan } from "@/features/auth";

import { createRole, updateRole } from "./roleHistoryApi";
import { roleHistoryQueryKey } from "./roleHistoryQuery";
import { roleFormSchema } from "./roleHistorySchema";

import type { RoleFormValues, RoleRow } from "./roleHistoryType";
import { ROLE_OPTIONS } from "./roleOptions";
import Permissions from "./Permissions";
import { permissionValuesFrom, toPermissionValues } from "@/features/auth/permissions";
import { getDefaultPermissions } from "@/features/auth/permissionsDefaultData";

interface AddRoleFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role?: RoleRow | null;
}

function stringValue(value: unknown): string {
    return typeof value === "string" ? value : "";
}

function initialValues(role?: RoleRow | null): RoleFormValues {
    const roleName = stringValue(role?.role);
    const saved = toPermissionValues(role?.permissions);
    // The API does not return grants yet, so an edit would otherwise open with
    // every box empty — fall back to the role's defaults in that case.
    const hasSavedGrants = Object.values(saved).some((section) => Object.values(section).some(Boolean));

    return {
        name: stringValue(role?.name),
        email: stringValue(role?.email),
        role: roleName.toUpperCase(),
        permissions: hasSavedGrants ? saved : permissionValuesFrom(getDefaultPermissions(roleName)),
        // startDate: role?.createdAtValue instanceof Date ? role.createdAtValue : new Date(),
    };
}

export default function AddRoleForm({ open, onOpenChange, role }: AddRoleFormProps) {
    const isEditing = Boolean(role);
    const canManageRoles = useCan("settings.roles.create");
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors },
    } = useForm<RoleFormValues>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: initialValues(role),
    });
    const selectedRole = useWatch({ control, name: "role" });

    useEffect(() => {
        if (open) reset(initialValues(role));
    }, [open, reset, role]);

    const saveRoleMutation = useMutation({
        mutationFn: (values: RoleFormValues) => {
            if (!canManageRoles) {
                return Promise.reject(new Error("You do not have permission to add or edit roles."));
            }
            const id = role?.id;
            return id ? updateRole(id, values) : createRole(values);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: roleHistoryQueryKey });
            onOpenChange(false);
            toast.add({
                type: "success",
                title: isEditing ? "Role updated" : "Role added",
                description: isEditing
                    ? "The role has been updated successfully."
                    : "The role has been added successfully.",
            })
        }
    });

    function saveRole(values: RoleFormValues) {
        if (!canManageRoles) return;
        saveRoleMutation.mutate(values);
    }

    return (
        <Modal
            open={open && canManageRoles}
            onOpenChange={(nextOpen) => {
                if (nextOpen && !canManageRoles) return;
                onOpenChange(nextOpen);
            }}
            title={isEditing ? "Edit role" : "Add role"}
            primaryAction={{
                label: isEditing ? (saveRoleMutation.isPending ? "Saving..." : "Save changes")
                    : (saveRoleMutation.isPending ? "Adding..." : "Add role"),
                onClick: handleSubmit(saveRole),
                disabled: saveRoleMutation.isPending || !canManageRoles,
            }}
            closeAction={{ label: "Cancel", disabled: saveRoleMutation.isPending }}
        >
            <form onSubmit={handleSubmit(saveRole)} noValidate>
                <FormGroup gap="sm">
                    <FormGroup gap="sm" col={2}>
                        <InputField
                            label="Name"
                            placeholder="Enter name"
                            labelClassName="text-sm font-medium"
                            error={errors.name?.message}
                            disabled={!canManageRoles}
                            {...register("name")}
                        />
                        <InputField
                            label="Email"
                            placeholder="Enter email"
                            labelClassName="text-sm font-medium"
                            error={errors.email?.message}
                            disabled={!canManageRoles}
                            {...register("email")}
                        />

                    </FormGroup>
                    <FormGroup gap="sm">
                        <SelectField
                            label="Role"
                            placeholder="Select role"
                            value={selectedRole}
                            error={errors.role?.message}
                            disabled={!canManageRoles}
                            onValueChange={(nextRole) => {
                                // Re-picking the same role must not wipe permissions already
                                // loaded from the API (or customised by hand).
                                if (!nextRole || nextRole === selectedRole) return;

                                setValue("role", nextRole, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                });
                                // Tick the boxes this role starts with; every one stays editable.
                                setValue("permissions", permissionValuesFrom(getDefaultPermissions(nextRole)), {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                });
                            }}
                            options={ROLE_OPTIONS}
                        />
                        <Permissions
                            control={control}
                            disabled={!canManageRoles || !selectedRole || saveRoleMutation.isPending}
                        />
                    </FormGroup>
                </FormGroup>
            </form>
        </Modal>
    );
}
