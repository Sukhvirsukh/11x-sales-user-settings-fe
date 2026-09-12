import Modal from "@/components/design/Modal";
import type { KnowledgeBase } from "./knowledgeBaseTypes";
import { FormGroup } from "@/components/design/FormGroup";
import { InputField } from "@/components/design/InputField";
import { useForm } from "react-hook-form";
import ImageUploader, { DOCUMENT_ACCEPT } from "@/components/design/ImageUploader";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { knowledgeBaseSchema, type KnowledgeBaseFormValues } from "./knowledgeBaseSchema";
import { useMutation } from "@tanstack/react-query";
import { updateKnowledgeBase } from "./knowledgeBaseApi";
import { queryClient } from "@/lib/queryClient";
import { knowledgeBaseQueryKey } from "./useKnowledgeBaseQuery";
import { toast } from "@/components/ui/toast";
import { useEffect } from "react";

type AddKnowledgeProps = {
    isOpen: boolean;
    handleModalOpenChange: (open: boolean) => void;
    data: KnowledgeBase | null
}

function initialValues(data: KnowledgeBase | null) {
    return {
        name: data?.name || "",
        url: data?.url || "",
    }
}

export default function AddKnowledge({ isOpen, handleModalOpenChange, data }: AddKnowledgeProps) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm<KnowledgeBaseFormValues>({
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
                label: "Save",
                onClick: handleSubmit(saveKnowledge),
            }}
            closeAction={{
                label: "Cancel",
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
                    <InputField
                        label="URL"
                        placeholder="Enter URL"
                        labelClassName="text-sm font-medium"
                        variant="light"
                        error={errors.url?.message}
                        {...register("url")}
                    />
                    <div className="flex items-center gap-3">
                        <Separator className="flex-1" />
                        <span className="text-xs font-medium text-muted-foreground">OR</span>
                        <Separator className="flex-1" />
                    </div>
                    <ImageUploader
                        label="Attach doc file"
                        accept={DOCUMENT_ACCEPT}
                        fileSize={5120}
                        variant="light"
                    />
                </FormGroup>
            </form>
        </Modal>
    )
}
