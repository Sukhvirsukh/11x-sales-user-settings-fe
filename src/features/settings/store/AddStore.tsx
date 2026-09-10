import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Modal from "@/components/design/Modal";
import { createStore, updateStore } from "./storeApi";
import { storeQueryKey } from "./storeQuery";
import { toast } from "@/components/ui/toast";
import { SelectField } from "@/components/design/SelectField";
import type { StoreFormData } from "./storeType";
import { storeSchema } from "./storeSchema";
import { Checkbox } from "@/components/ui/checkbox";
import Label from "@/components/design/Label";

type StoreRow = Record<string, unknown>;

const ownerOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Editor", label: "Editor" },
    { value: "Agent", label: "Agent" },
    { value: "Member", label: "Member" },
];

interface AddStoreProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    store?: StoreRow | null;
}


function stringValue(value: unknown): string {
    return typeof value === "string" ? value : "";
}

function booleanValue(value: unknown, fallback: boolean): boolean {
    return typeof value === "boolean" ? value : fallback;
}

function initialValues(store?: StoreRow | null): StoreFormData {
    const owner = stringValue(store?.owner) || "Admin";

    return {
        name: stringValue(store?.name),
        url: stringValue(store?.url),
        owner,
        isDefault: booleanValue(store?.isDefault, false),
        status: booleanValue(store?.status, true),
    };
}

export default function AddStore({ open, onOpenChange, store }: AddStoreProps) {
    const isEditing = Boolean(store);
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<StoreFormData>({
        resolver: zodResolver(storeSchema),
        defaultValues: initialValues(store),
    });

    useEffect(() => {
        if (open) reset(initialValues(store));
    }, [open, reset, store]);

    const saveStoreMutation = useMutation({
        mutationFn: (values: StoreFormData) => {
            const id = typeof store?.id === "string" ? store.id : undefined;
            const payload = {
                name: values.name,
                url: values.url,
                owner: values.owner,
                status: values.status,
                isDefault: values.isDefault,
                startDate: values.startDate?.toISOString(),
            };

            return id ? updateStore(id, payload) : createStore(payload);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: storeQueryKey });
            onOpenChange(false);
            toast.add({
                type: "success",
                title: isEditing ? "Store updated" : "Store added",
                description: isEditing
                    ? "The store has been updated successfully."
                    : "The store has been added successfully.",
            });
        },
        onError: () => {
            toast.add({
                type: "error",
                title: isEditing ? "Unable to update store" : "Unable to add store",
                description: "Please try again.",
            });
        },
    });

    function saveStore(values: StoreFormData) {
        saveStoreMutation.mutate(values);
    }

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={isEditing ? "Edit store" : "Add store"}
            primaryAction={{
                label: isEditing
                    ? saveStoreMutation.isPending
                        ? "Saving..."
                        : "Save changes"
                    : saveStoreMutation.isPending
                        ? "Adding..."
                        : "Add store",
                onClick: handleSubmit(saveStore),
                disabled: saveStoreMutation.isPending,
            }}
            closeAction={{ label: "Cancel", disabled: saveStoreMutation.isPending }}
        >
            <form onSubmit={handleSubmit(saveStore)} noValidate>
                <FormGroup gap="sm">
                    <InputField
                        label="Store Name"
                        placeholder="Enter store name"
                        labelClassName="text-sm font-medium"
                        variant="light"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <InputField
                        label="Store URL"
                        placeholder="https://your-store.myshopify.com"
                        labelClassName="text-sm font-medium"
                        variant="light"
                        error={errors.url?.message}
                        {...register("url")}
                    />

                    <Controller
                        name="owner"
                        control={control}
                        defaultValue="Admin"
                        render={({ field }) => (
                            <SelectField
                                label="Store Owner"
                                placeholder="Select owner"
                                error={errors.owner?.message}
                                value={field.value}
                                onValueChange={(owner) => field.onChange(owner ?? "")}
                                options={ownerOptions}
                                variant="light"
                            />
                        )}
                    />
                    <Controller
                        name="isDefault"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Checkbox id="isDefault" checked={field.value} onCheckedChange={field.onChange} />
                                <Label htmlFor="isDefault" className="cursor-pointer text-sm text-gray">
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
                                <Label htmlFor="status" className="cursor-pointer text-sm text-gray">
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
