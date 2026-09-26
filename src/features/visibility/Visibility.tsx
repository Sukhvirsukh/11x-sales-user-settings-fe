import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { UnSavedChangesBar } from "@/components/shared/unsavedChangesBar";
import ErrorDialog from "@/components/shared/ErrorDialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import allAccordions from "./AllAccordions";
import Preview from "./preview/Preview";
import { Spinner } from "@/components/ui/spinner";
import type { VisibilityFields } from "./visibilityTypes";
import { useVisibilityQuery, visibilityQueryKey } from "./visibilityQuery";
import { requiredFieldsSchema } from "./fields/validations";
import { saveVisibility, uploadChatFace } from "./visibilityApi";
import ResetVisibilityModal from "./ResetVisibilityModal";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useCan } from "../auth";

export default function Visibility() {
    const canSaveVisibility = useCan("chatSettings.create");
    const navigate = useNavigate();
    const query = useVisibilityQuery();
    const queryClient = useQueryClient();
    const form = useForm<VisibilityFields>();
    const [isMaximized, setIsMaximized] = useState(false);
    const [isFormReady, setIsFormReady] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    useEffect(() => {
        if (query.data) {
            form.reset(query.data);
            setIsFormReady(true);
        }
    }, [form, query.data]);

    function onDiscardChanges() {
        form.reset(query.data);
        form.clearErrors();
        setValidationErrors([]);
        setErrorMessage(undefined);
        setErrorDialogOpen(false);
    }

    async function saveChange() {
        if (!canSaveVisibility) {
            return
        }
        const values = form.getValues();
        const result = requiredFieldsSchema.safeParse(values);

        if (!result.success) {
            result.error.issues.forEach((issue) => {
                const field = issue.path[0];
                if (typeof field === "string") {
                    form.setError(field as keyof VisibilityFields, {
                        type: "validate",
                        message: issue.message,
                    });
                }
            });

            const messages = result.error.issues.map((issue) => {
                const field = issue.path[0]
                    ?.toString()
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (character) => character.toUpperCase())
                    .trim() || "Field";
                return `${field}: ${issue.message}`;
            });

            setValidationErrors(messages);
            setErrorMessage(undefined);
            setErrorDialogOpen(true);
            return;
        }

        await form.handleSubmit(async (data) => {
            try {
                let chatFace = data.chatFace;

                if (chatFace instanceof File) {
                    chatFace = await uploadChatFace(chatFace);
                    form.setValue("chatFace", chatFace, { shouldDirty: true });
                }

                const savedData = await saveVisibility({ ...data, chatFace });
                queryClient.setQueryData(visibilityQueryKey, savedData);
                form.reset(savedData);
            } catch (error) {
                setValidationErrors([]);
                setErrorMessage(error instanceof Error ? error.message : "Unable to save visibility settings.");
                setErrorDialogOpen(true);
            }
        })();
    }


    if (query.error) {
        throw query.error
    }

    if (!query.data || !isFormReady) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-content-muted">
                <Spinner className="size-10 text-primary" />
            </div>
        );
    }

    return (
        <FormProvider {...form}>
            <div className="flex min-h-full min-w-0 flex-col md:h-full md:min-h-0">
                <div className="pb-5 md:py-0">
                    <Button
                        variant="bare"
                        className="flex items-center gap-1 p-0! mb-0 text-base md:p-2.5! md:mb-2.5"
                        onClick={() => navigate('/chat-settings')}
                    >
                        <ChevronLeft size={18} /> Back to settings
                    </Button>
                </div>

                <div className="relative flex flex-col items-stretch gap-3.5 md:min-h-0 md:flex-1 md:flex-row">
                    <aside
                        className={`flex min-w-0 shrink-0 flex-col gap-2 md:min-h-0 md:max-h-full md:w-auto md:self-stretch md:transition-[flex-basis,max-width] md:duration-500 md:ease-in-out motion-reduce:transition-none ${isMaximized ? "md:basis-[calc(100%-500px-0.875rem)] md:max-w-[calc(100%-500px-0.875rem)]" : "md:basis-[30%] md:max-w-75 2xl:max-w-none"}`}
                    >
                        <div className="flex min-w-0 flex-initial flex-col overflow-hidden rounded-[10px] border border-border bg-background shadow-blue md:min-h-0 md:max-h-full">
                            <div className="min-w-0 px-3 sm:px-4 md:min-h-0 md:overflow-y-auto">
                                <Accordion>
                                    {allAccordions.map((tab) => (
                                        <AccordionItem key={tab.id} value={tab.id}>
                                            <AccordionTrigger className="py-4 text-lg font-semibold text-foreground">
                                                {tab.label}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <tab.content />
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>

                        <footer className="mt-auto shrink-0 pb-1 sm:pb-2">
                            {canSaveVisibility && <ResetVisibilityModal />}
                        </footer>
                    </aside>

                    <div
                        className="relative flex h-150 min-w-0 shrink-0 flex-col overflow-hidden rounded-[10px] border border-section-border bg-preview-section-background shadow-blue md:h-auto md:min-h-0 md:flex-1 md:shrink"
                    >
                        <Preview
                            isMaximized={isMaximized}
                            onToggleMaximize={() => setIsMaximized((current) => !current)}
                        />

                        {canSaveVisibility && <UnSavedChangesBar
                            isDirty={form.formState.isDirty}
                            onSave={saveChange}
                            saveDisabled={!canSaveVisibility}
                            onDiscard={onDiscardChanges}
                            primaryColor={form.watch("primaryColor")}
                            placement="inline"
                            edge="bottom"
                            className="absolute inset-x-0 bottom-0 z-40"
                        />}
                    </div>
                </div>

                <ErrorDialog
                    open={errorDialogOpen}
                    onOpenChange={setErrorDialogOpen}
                    title="Validation Error"
                    description={errorMessage}
                    errors={validationErrors}
                />

            </div>
        </FormProvider>
    );
}
