import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Modal from "@/components/design/Modal";
import { SelectField } from "@/components/design/SelectField";
import { TextAreaField } from "@/components/design/TextAreaField";
import { toast } from "@/components/ui/toast";

import { updateCorrection } from "./correctionsApi";
import { correctionsQueryKey } from "./correctionsQuery";
import { correctionFormSchema } from "./correctionSchema";
import type { Correction, CorrectionFormValues } from "./correctionTypes";

interface EditCorrectionProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    correction: Correction | null;
}

const DEFAULT_VALUES: CorrectionFormValues = {
    name: "",
    corrections: "",
    status: "Active",
};

function toFormValues(correction: Correction | null): CorrectionFormValues {
    if (!correction) return DEFAULT_VALUES;
    return {
        name: correction.name,
        corrections: correction.corrections,
        status: correction.status,
    };
}

export default function EditCorrection({ open, onOpenChange, correction }: EditCorrectionProps) {
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CorrectionFormValues>({
        resolver: zodResolver(correctionFormSchema),
        defaultValues: DEFAULT_VALUES,
    });

    useEffect(() => {
        if (open) reset(toFormValues(correction));
    }, [correction, open, reset]);

    const editMutation = useMutation({
        mutationFn: (values: CorrectionFormValues) => {
            if (!correction) return Promise.reject(new Error("No correction selected."));
            return updateCorrection(correction.id, values);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: correctionsQueryKey });
            onOpenChange(false);
            toast.add({
                type: "success",
                title: "Correction updated",
                description: "The correction has been updated successfully.",
            });
        },
        onError: (error) => {
            toast.add({
                type: "error",
                title: "Unable to update correction",
                description: error.message,
            });
        },
    });

    const submitCorrection = handleSubmit((values) => editMutation.mutate(values));

    return (
        <Modal
            open={open}
            onOpenChange={(nextOpen) => {
                if (!editMutation.isPending) onOpenChange(nextOpen);
            }}
            title="Edit correction"
            primaryAction={{
                label: editMutation.isPending ? "Saving..." : "Save",
                onClick: submitCorrection,
                disabled: editMutation.isPending || correction === null,
            }}
            closeAction={{ label: "Cancel", disabled: editMutation.isPending }}
        >
            <form onSubmit={submitCorrection} noValidate>
                <FormGroup gap="sm">
                    <InputField
                        label="Name"
                        placeholder="Enter name"
                        labelClassName="text-sm font-medium"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <TextAreaField
                        label="Correction"
                        placeholder="Enter correction"
                        labelClassName="text-sm font-medium"
                        error={errors.corrections?.message}
                        {...register("corrections")}
                    />
                    <SelectField
                        label="Status"
                        labelClassName="text-sm font-medium"
                        value={watch("status")}
                        onValueChange={(status) => {
                            if (status === "Active" || status === "Inactive") {
                                setValue("status", status, { shouldDirty: true, shouldValidate: true });
                            }
                        }}
                        options={[
                            { value: "Active", label: "Active" },
                            { value: "Inactive", label: "Inactive" },
                        ]}
                    />
                </FormGroup>
            </form>
        </Modal>
    );
}
