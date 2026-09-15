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
import { useEffect, useMemo } from "react";
import { SelectField } from "@/components/design/SelectField";
import { TextAreaField } from "@/components/design/TextAreaField";
import { Download } from "lucide-react";

const FILE_UPLOAD_CONFIG = {
    Doc: { label: "Attach document file", accept: DOCUMENT_ACCEPT },
    Pdf: { label: "Attach PDF file", accept: PDF_ACCEPT },
    Csv: { label: "Attach CSV file", accept: CSV_ACCEPT },
};

type AddKnowledgeProps = {
    isOpen: boolean;
    handleModalOpenChange: (open: boolean) => void;
    data: KnowledgeBase | null
}

function initialValues(data: KnowledgeBase | null): KnowledgeBaseFormValues {
    const isFileFormat = data?.format === "Doc" || data?.format === "Pdf" || data?.format === "Csv";
    const existingFile = data?.file instanceof File || typeof data?.file === "string"
        ? data.file
        : isFileFormat && data?.url ? data.url : null;

    return {
        name: data?.name || "",
        url: data?.url || "",
        format: data?.format ?? "Link",
        file: existingFile,
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

    const format = watch("format");
    const fileUploadConfig = format in FILE_UPLOAD_CONFIG
        ? FILE_UPLOAD_CONFIG[format as keyof typeof FILE_UPLOAD_CONFIG]
        : null;
    const existingFileUrl = useMemo(() => {
        const isFileFormat = data?.format === "Doc" || data?.format === "Pdf" || data?.format === "Csv";
        if (isFileFormat && data?.url) return data.url;
        if (typeof data?.file === "string") return data.file;
        return data?.file ? URL.createObjectURL(data.file) : null;
    }, [data?.file, data?.format, data?.url]);

    useEffect(() => {
        return () => {
            if (existingFileUrl?.startsWith("blob:")) URL.revokeObjectURL(existingFileUrl);
        };
    }, [existingFileUrl]);

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
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <SelectField
                        label="Format"
                        labelClassName="text-sm font-medium"
                        placeholder="Select format"
                        value={format}
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
                            { value: "Csv", label: "Csv" },
                            { value: "Text", label: "Text" },
                        ]}
                    />
                    {format === "Link" ?
                        <InputField
                            label="URL"
                            placeholder="Enter URL"
                            labelClassName="text-sm font-medium"
                            error={errors.url?.message}
                            {...register("url")}
                        />
                        : fileUploadConfig ?
                            <div className="flex flex-col gap-2">
                                <Controller
                                    name="file"
                                    control={control}
                                    render={({ field }) => (
                                        <ImageUploader
                                            label={fileUploadConfig.label}
                                            accept={fileUploadConfig.accept}
                                            fileSize={5120}
                                            value={field.value ?? null}
                                            onValueChange={field.onChange}
                                        />
                                    )}
                                />
                                {existingFileUrl ? (
                                    <a
                                        href={existingFileUrl}
                                        download
                                        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                                    >
                                        <Download className="size-4" aria-hidden />
                                        Download current file
                                    </a>
                                ) : null}
                            </div>
                            :
                            <TextAreaField
                                label="Text"
                                placeholder="Enter text"
                                labelClassName="text-sm font-medium"
                                error={errors.text?.message}
                                {...register("text")}
                            />
                    }
                </FormGroup>
            </form>
        </Modal>
    )
}
