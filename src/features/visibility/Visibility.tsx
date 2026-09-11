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
import { saveVisibility } from "./visibilityApi";

export default function Visibility() {
    const query = useVisibilityQuery();
    const queryClient = useQueryClient();
    const form = useForm<VisibilityFields>();
    const [isMaximized, setIsMaximized] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isFormReady, setIsFormReady] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    useEffect(() => {
        if (query.data) {
            console.log("query.data", query.data);
            form.reset(query.data);
            setIsFormReady(true);
        }
    }, [form, query.data]);

    if (query.error) {
        throw query.error
    }

    if (!query.data || !isFormReady) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-ghost">
                <Spinner className="size-10 text-primary" />
            </div>
        );
    }

    return (
        <FormProvider {...form}>
            <div className="flex h-full min-h-0 min-w-0 flex-col">
                <div className="relative flex min-h-0 flex-1 flex-row items-stretch gap-4">
                    {isSettingsOpen && (
                        <button
                            type="button"
                            aria-label="Close settings"
                            className="absolute inset-0 z-40 bg-muted/80 md:hidden"
                            onClick={() => setIsSettingsOpen(false)}
                        />
                    )}

                    <aside
                        className={`min-h-0 min-w-0 overflow-y-auto rounded-[10px] border border-border bg-background shadow-blue transition-[flex-basis,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSettingsOpen
                            ? "absolute inset-y-0 left-0 z-50 w-[min(92vw,360px)]"
                            : "pointer-events-none absolute inset-y-0 left-0 z-50 w-[min(92vw,360px)] -translate-x-full"
                            } md:pointer-events-auto md:relative md:inset-auto md:z-auto md:block md:h-auto md:w-auto md:shrink-0 md:self-start md:translate-x-0 ${isMaximized ? "md:basis-[70%]" : "md:basis-[30%] md:max-w-75"}`}
                    >
                        <div className="h-fit min-w-0 px-3 sm:px-4 md:min-h-0">
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
                    </aside>

                    <div
                        className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-border bg-card shadow-blue transition-[flex-basis] duration-300 ease-in-out ${isMaximized ? "md:basis-[30%] md:flex-none" : "min-w-0 flex-1"}`}
                    >
                        <Preview
                            isMaximized={isMaximized}
                            onToggleMaximize={() => setIsMaximized((prev) => !prev)}
                            isSettingsOpen={isSettingsOpen}
                            onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
                        />
                    </div>
                </div>

                <UnSavedChangesBar
                    isDirty={form.formState.isDirty}
                    onSave={async () => {
                        const values = form.getValues();
                        const result = requiredFieldsSchema.safeParse(values);
                        if (!result.success) {
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
                            const savedData = await saveVisibility(data);
                            queryClient.setQueryData(visibilityQueryKey, savedData);
                            form.reset(savedData);
                        })();
                    }}
                    onDiscard={() => form.reset(query.data)}
                    placement="fixed"
                />

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
