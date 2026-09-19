import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "@/components/design/DatePicker";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Modal from "@/components/design/Modal";
import { toast } from "@/components/ui/toast";
import { segmentFormSchema } from "./contactSchema";
import { createSegament } from "./contactsApi";
import { segmentsQueryKey } from "./contactQuery";
import type { SegmentFormValues } from "./contactType";

interface AddSegmentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: Partial<SegmentFormValues> = {
    name: "",
};

export default function AddSegment({ open, onOpenChange }: AddSegmentProps) {
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SegmentFormValues>({
        resolver: zodResolver(segmentFormSchema),
        defaultValues: DEFAULT_VALUES,
    });

    useEffect(() => {
        if (open) reset(DEFAULT_VALUES);
    }, [open, reset]);

    const addSegmentMutation = useMutation({
        mutationFn: createSegament,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: segmentsQueryKey });
            onOpenChange(false);
            toast.add({
                type: "success",
                title: "Segament added",
                description: "The segament has been added successfully.",
            })
        },
    });

    function addSegament(values: SegmentFormValues) {
        addSegmentMutation.mutate(values);
    }

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Add segment"
            primaryAction={{
                label: addSegmentMutation.isPending ? "Adding..." : "Add segment",
                onClick: handleSubmit(addSegament),
                disabled: addSegmentMutation.isPending,
            }}
            closeAction={{ label: "Cancel", disabled: addSegmentMutation.isPending }}
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
