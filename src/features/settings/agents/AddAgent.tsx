import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Modal from "@/components/design/Modal";
import { createAgent, updateAgent } from "./agentsApi";
import { agentsQueryKey } from "./agentsQuery";
import { toast } from "@/components/ui/toast";
import { SelectField } from "@/components/design/SelectField";
import type { AgentFormData } from "./agentType";
import { agentSchema } from "./agentSchema";
import { Checkbox } from "@/components/ui/checkbox";
import Label from "@/components/design/Label";

type AgentRow = Record<string, unknown>;

const ownerOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Editor", label: "Editor" },
    { value: "Agent", label: "Agent" },
    { value: "Member", label: "Member" },
];

interface AddAgentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agent?: AgentRow | null;
}


function stringValue(value: unknown): string {
    return typeof value === "string" ? value : "";
}

function booleanValue(value: unknown, fallback: boolean): boolean {
    return typeof value === "boolean" ? value : fallback;
}

function initialValues(agent?: AgentRow | null): AgentFormData {
    const owner = stringValue(agent?.owner) || "Admin";

    return {
        name: stringValue(agent?.name),
        url: stringValue(agent?.url),
        owner,
        isDefault: booleanValue(agent?.isDefault, false),
        status: booleanValue(agent?.status, true),
    };
}

export default function AddAgent({ open, onOpenChange, agent }: AddAgentProps) {
    const isEditing = Boolean(agent);
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<AgentFormData>({
        resolver: zodResolver(agentSchema),
        defaultValues: initialValues(agent),
    });

    useEffect(() => {
        if (open) reset(initialValues(agent));
    }, [open, reset, agent]);

    const saveAgentMutation = useMutation({
        mutationFn: (values: AgentFormData) => {
            const id = typeof agent?.id === "string" ? agent.id : undefined;
            const payload = {
                name: values.name,
                url: values.url,
                owner: values.owner,
                status: values.status,
                isDefault: values.isDefault,
                startDate: values.startDate?.toISOString(),
            };

            return id ? updateAgent(id, payload) : createAgent(payload);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: agentsQueryKey });
            onOpenChange(false);
            toast.add({
                type: "success",
                title: isEditing ? "Agent updated" : "Agent added",
                description: isEditing
                    ? "The agent has been updated successfully."
                    : "The agent has been added successfully.",
            });
        },
        onError: () => {
            toast.add({
                type: "error",
                title: isEditing ? "Unable to update agent" : "Unable to add agent",
                description: "Please try again.",
            });
        },
    });

    function saveAgent(values: AgentFormData) {
        saveAgentMutation.mutate(values);
    }

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditing ? "Edit agent" : "Add agent"}
            primaryAction={{
                label: isEditing
                    ? saveAgentMutation.isPending
                        ? "Saving..."
                        : "Save changes"
                    : saveAgentMutation.isPending
                        ? "Adding..."
                        : "Add agent",
                onClick: handleSubmit(saveAgent),
                disabled: saveAgentMutation.isPending,
            }}
            closeAction={{ label: "Cancel", disabled: saveAgentMutation.isPending }}
        >
            <form onSubmit={handleSubmit(saveAgent)} noValidate>
                <FormGroup gap="sm">
                    <InputField
                        label="Agent Name"
                        placeholder="Enter agent name"
                        labelClassName="text-sm font-medium"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <InputField
                        label="Store URL"
                        placeholder="Enter store URL here"
                        labelClassName="text-sm font-medium"
                        error={errors.url?.message}
                        {...register("url")}
                    />

                    <Controller
                        name="owner"
                        control={control}
                        defaultValue="Admin"
                        render={({ field }) => (
                            <SelectField
                                label="Agent Owner"
                                placeholder="Select owner"
                                error={errors.owner?.message}
                                value={field.value}
                                onValueChange={(owner) => field.onChange(owner ?? "")}
                                options={ownerOptions}
                            />
                        )}
                    />
                    <Controller
                        name="isDefault"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Checkbox id="isDefault" checked={field.value} onCheckedChange={field.onChange} />
                                <Label htmlFor="isDefault" className="cursor-pointer text-sm text-content-muted">
                                    Set as default
                                </Label>
                            </div>
                        )}
                    />
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Checkbox id="status" checked={field.value} onCheckedChange={field.onChange} />
                                <Label htmlFor="status" className="cursor-pointer text-sm text-content-muted">
                                    Is active
                                </Label>
                            </div>
                        )}
                    />

                </FormGroup>
            </form>
        </Modal>
    );
}