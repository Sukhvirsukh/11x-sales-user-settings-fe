import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "@/components/design/DatePicker";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Modal from "@/components/design/Modal";
import { toast } from "@/components/ui/toast";
import { segamentFormSchema } from "./contactSchema";
import { createSegament } from "./contactsApi";
import { segamentsQueryKey } from "./contactQuery";
import type { SegamentFormValues } from "./contactType";

interface AddSegamentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: Partial<SegamentFormValues> = {
    name: "",
};

export default function AddSegament({ open, onOpenChange }: AddSegamentProps) {
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SegamentFormValues>({
        resolver: zodResolver(segamentFormSchema),
        defaultValues: DEFAULT_VALUES,
    });

    useEffect(() => {
        if (open) reset(DEFAULT_VALUES);
    }, [open, reset]);

    const addSegamentMutation = useMutation({
        mutationFn: createSegament,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: segamentsQueryKey });
            onOpenChange(false);
            toast.add({
                type: "success",
                title: "Segament added",
                description: "The segament has been added successfully.",
            })
        },
    });

    function addSegament(values: SegamentFormValues) {
        addSegamentMutation.mutate(values);
    }

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Add segament"
            primaryAction={{
                label: addSegamentMutation.isPending ? "Adding..." : "Add segament",
                onClick: handleSubmit(addSegament),
                disabled: addSegamentMutation.isPending,
            }}
            closeAction={{ label: "Cancel", disabled: addSegamentMutation.isPending }}
        >
            <form onSubmit={handleSubmit(addSegament)} noValidate>
                <FormGroup gap="sm">
                    <InputField
                        label="Name"
                        placeholder="Enter name"
                        labelClassName="text-sm font-medium"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <DatePicker
                        label="Active schedule"
                        placeholder="Pick a date"
                        labelClassName="text-sm font-medium"
                        value={watch("activeSchedule")}
                        error={errors.activeSchedule?.message}
                        onChange={(activeSchedule) => {
                            if (activeSchedule) setValue("activeSchedule", activeSchedule, { shouldValidate: true });
                        }}
                    />
                </FormGroup>
            </form>
        </Modal>
    );
}
