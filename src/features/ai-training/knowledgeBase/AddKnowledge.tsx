import Modal from "@/components/design/Modal";
import type { KnowledgeBase } from "./knowledgeBaseTypes";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import { Controller, useForm } from "react-hook-form";
import ImageUploader, { CSV_ACCEPT, DOCUMENT_ACCEPT, PDF_ACCEPT } from "@/components/design/ImageUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { knowledgeBaseSchema, type KnowledgeBaseFormValues } from "./knowledgeBaseSchema";
import { useMutation } from "@tanstack/react-query";
import { updateKnowledgeBase } from "./knowledgeBaseApi";
import { queryClient } from "@/lib/queryClient";
import { knowledgeBaseQueryKey } from "./useKnowledgeBaseQuery";
import { toast } from "@/components/ui/toast";
import { useEffect } from "react";
import { SelectField } from "@/components/design/SelectField";
import { TextAreaField } from "@/components/design/TextAreaField";

type AddKnowledgeProps = {
    isOpen: boolean;
    handleModalOpenChange: (open: boolean) => void;
    data: KnowledgeBase | null
}

function initialValues(data: KnowledgeBase | null): KnowledgeBaseFormValues {
    return {
        name: data?.name || "",
        url: data?.url || "",
        format: data?.format ?? "Link",
        file: null,
        text: data?.text || "",
    }
}

export default function AddKnowledge({ isOpen, handleModalOpenChange, data }: AddKnowledgeProps) {

    const { register, handleSubmit, watch, reset, setValue, clearErrors, control, formState: { errors } } = useForm<KnowledgeBaseFormValues>({
        resolver: zodResolver(knowledgeBaseSchema),
        defaultValues: initialValues(data),
    })

    const saveKnowledgeMutation = useMutation({
        mutationFn: (values: KnowledgeBaseFormValues) => {
            return updateKnowledgeBase({ ...values, id: data?.id })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: knowledgeBaseQueryKey });
            handleModalOpenChange(false);
            toast.add({
                type: "success",
                title: "Knowledge added",
                description: "The knowledge has been added successfully.",
            })
        }
    })

    useEffect(() => {
        if (isOpen) reset(initialValues(data));
    }, [isOpen, reset, data]);


    const saveKnowledge = (values: KnowledgeBaseFormValues) => {
        saveKnowledgeMutation.mutate(values);
    }

    return (
        <Modal
            open={isOpen}
            onOpenChange={handleModalOpenChange}
            title="Edit details"
            primaryAction={{
                label: saveKnowledgeMutation.isPending ? "Saving..." : "Save",
                onClick: handleSubmit(saveKnowledge),
                disabled: saveKnowledgeMutation.isPending,
            }}
            closeAction={{
                label: "Cancel",
                disabled: saveKnowledgeMutation.isPending
            }}
        >
            <form onSubmit={handleSubmit(saveKnowledge)} noValidate>
                <FormGroup gap="sm">
                    <InputField
                        label="Name"
                        placeholder="Enter Name"
                        labelClassName="text-sm font-medium"
                        variant="light"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <SelectField
                        label="Format"
                        labelClassName="text-sm font-medium"
                        placeholder="Select format"
                        value={watch("format")}
                        error={errors.format?.message}
                        onValueChange={(format) => {
                            const nextFormat = format as KnowledgeBaseFormValues["format"];

                            setValue("format", nextFormat, { shouldValidate: true });
                            setValue("file", null);
                            setValue("text", "");
                            setValue("url", "");
                            clearErrors(["file", "text", "url"]);
                        }}
                        options={[
                            { value: "Link", label: "Link" },
                            { value: "Doc", label: "Document" },
                            { value: "Pdf", label: "Pdf" },
                            { value: "CSV", label: "Csv" },
                            { value: "Text", label: "Text" },
                        ]}
                        variant="light"
                    />
                    {watch("format") === "Link" ?
                        <InputField
                            label="URL"
                            placeholder="Enter URL"
                            labelClassName="text-sm font-medium"
                            variant="light"
                            error={errors.url?.message}
                            {...register("url")}
                        />
                        :
                        watch("format") === "Doc" ?
                            <Controller
                                name="file"
                                control={control}
                                render={({ field }) => (
                                    <ImageUploader
                                        label="Attach doc file"
                                        accept={DOCUMENT_ACCEPT}
                                        fileSize={5120}
                                        variant="light"
                                        value={field.value ?? null}
                                        onValueChange={field.onChange}
                                    />
                                )}
                            />
                            :
                            watch("format") === "Pdf" ?
                                <Controller
                                    name="file"
                                    control={control}
                                    render={({ field }) => (
                                        <ImageUploader
                                            label="Attach pdf file"
                                            accept={PDF_ACCEPT}
                                            fileSize={5120}
                                            variant="light"
                                            value={field.value ?? null}
                                            onValueChange={field.onChange}
                                        />
                                    )}
                                />
                                :
                                watch('format') === "CSV" ?
                                    <Controller
                                        name="file"
                                        control={control}
                                        render={({ field }) => (
                                            <ImageUploader
                                                label="Attach csv file"
                                                accept={CSV_ACCEPT}
                                                fileSize={5120}
                                                variant="light"
                                                value={field.value ?? null}
                                                onValueChange={field.onChange}
                                            />
                                        )}
                                    />
                                    :

                                    <TextAreaField
                                        label="Text"
                                        placeholder="Enter text"
                                        labelClassName="text-sm font-medium"
                                        variant="light"
                                        error={errors.text?.message}
                                        {...register("text")}
                                    />
                    }
                </FormGroup>
            </form>
        </Modal>
    )
}
