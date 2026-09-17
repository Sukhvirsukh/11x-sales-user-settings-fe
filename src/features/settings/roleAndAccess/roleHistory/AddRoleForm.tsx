import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Modal from "@/components/design/Modal";
import { SelectField } from "@/components/design/SelectField";
import { createRole, updateRole } from "./roleHistoryApi";
import { roleHistoryQueryKey } from "./roleHistoryQuery";
import { roleFormSchema } from "./roleHistorySchema";
import type { RoleFormValues, RoleRow } from "./roleHistoryType";
import { toast } from "@/components/ui/toast";
import Permissions from "../permissions";

interface AddRoleFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role?: RoleRow | null;
}

function stringValue(value: unknown): string {
    return typeof value === "string" ? value : "";
}

function initialValues(role?: RoleRow | null): RoleFormValues {
    return {
        name: stringValue(role?.name),
        email: stringValue(role?.email),
        role: stringValue(role?.role).toLowerCase(),
        // startDate: role?.createdAtValue instanceof Date ? role.createdAtValue : new Date(),
    };
}

export default function AddRoleForm({ open, onOpenChange, role }: AddRoleFormProps) {
    const isEditing = Boolean(role);
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<RoleFormValues>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: initialValues(role),
    });

    useEffect(() => {
        if (open) reset(initialValues(role));
    }, [open, reset, role]);

    const saveRoleMutation = useMutation({
        mutationFn: (values: RoleFormValues) => {
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
        },
        onError: async (err) => {
            toast.add({
                type: "error",
                title: isEditing ? "Role updated" : "Role added",
                description: err.message,
            })
        }
    });

    function saveRole(values: RoleFormValues) {
        saveRoleMutation.mutate(values);
    }

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditing ? "Edit role" : "Add role"}
            primaryAction={{
                label: isEditing ? (saveRoleMutation.isPending ? "Saving..." : "Save changes")
                    : (saveRoleMutation.isPending ? "Adding..." : "Add role"),
                onClick: handleSubmit(saveRole),
                disabled: saveRoleMutation.isPending,
            }}
            closeAction={{ label: "Cancel", disabled: saveRoleMutation.isPending }}
        >
            <form onSubmit={handleSubmit(saveRole)} noValidate>
                <FormGroup gap="sm">
                    <InputField
                        label="Name"
                        placeholder="Enter name"
                        labelClassName="text-sm font-medium"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <InputField
                        label="Email"
                        placeholder="Enter email"
                        labelClassName="text-sm font-medium"
                        error={errors.email?.message}
                        {...register("email")}
                    />
                    <SelectField
                        label="Role"
                        placeholder="Select role"
                        value={watch("role")}
                        error={errors.role?.message}
                        onValueChange={(role) => setValue("role", role ?? "", { shouldValidate: true })}
                        options={[
                            { value: "ADMIN", label: "Admin" },
                            { value: "EDITOR", label: "Editor" },
                            { value: "AGENT", label: "Agent" },
                            { value: "MEMBER", label: "Member" },
                        ]}
                    />
                    <div>
                        <Permissions />
                    </div>
                </FormGroup>
            </form>
        </Modal>
    );
}
