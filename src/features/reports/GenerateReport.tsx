import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DatePicker } from "@/components/design/DatePicker";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import Modal from "@/components/design/Modal";
import { Button } from "@/components/ui/button";
import type { ReportFormValues } from "./reportType";
import { reportFormSchema } from "./reportSchema";
import { useMutation } from "@tanstack/react-query";
import { addReport } from "./reportApi";
import { queryClient } from "@/lib/queryClient";
import { reportQueryKey } from "./reportQuery";
import { toast } from "@/components/ui/toast";

export default function GenerateReport() {
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ReportFormValues>({
        resolver: zodResolver(reportFormSchema)
    })


    const generateReportMutation = useMutation({
        mutationFn: (reportFormValues: ReportFormValues) => {
            return addReport(reportFormValues)
        },
        onSuccess: async (data) => {
            setIsOpen(false);
            await queryClient.invalidateQueries({ queryKey: reportQueryKey });
            toast.add({
                type: "success",
                title: "Report added",
                description: "The report has been added successfully.",
            })
        },
        onError: () => {
            toast.add({
                type: "error",
                title: "Report not added",
                description: "Something went wrong. Please try again.",
            })
        }
    })

    const saveReport = (reportFormValues: ReportFormValues) => {
        generateReportMutation.mutate(reportFormValues);
    }

    return (
        <Modal
            trigger={
                <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
                    Generate Report
                    <Plus className="md:ml-2 ml-0.5 md:size-4 size-2" />
                </Button>
            }
            open={isOpen}
            onOpenChange={setIsOpen}
            title="Generate report"
            primaryAction={{
                label: 'Generate',
                onClick: handleSubmit(saveReport),
                disabled: generateReportMutation.isPending,
            }}
            closeAction={{
                label: "Cancel",
                disabled: generateReportMutation.isPending
            }}
        >
            <form onSubmit={handleSubmit(saveReport)} noValidate>
                <FormGroup gap="sm">
                    <InputField
                        label="Source name"
                        placeholder="Enter source name"
                        labelClassName="text-sm font-medium"
                        variant="light"
                        error={errors.source?.message}
                        {...register("source")}
                    />
                    <FormGroup gap="sm" col={2}>
                        <DatePicker
                            label="Start date"
                            placeholder="Pick a date"
                            labelClassName="text-sm font-medium"
                            variant="light"
                            value={watch("startDate")}
                            error={errors.startDate?.message}
                            onChange={(startDate) => {
                                if (startDate) setValue("startDate", startDate, { shouldValidate: true });
                            }}
                        />
                        <DatePicker
                            label="End date"
                            placeholder="Pick a date"
                            labelClassName="text-sm font-medium"
                            variant="light"
                            value={watch("endDate")}
                            error={errors.endDate?.message}
                            onChange={(endDate) => {
                                if (endDate) setValue("endDate", endDate, { shouldValidate: true });
                            }}
                        />
                    </FormGroup>
                </FormGroup>
            </form>
        </Modal>
    )
}
