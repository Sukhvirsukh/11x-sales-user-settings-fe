import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ArrowLeft, Maximize2, Minimize2, PanelLeftOpen, X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import type { VisibilityFields } from "./visibilityTypes";
import { useVisibilityQuery, visibilityQueryKey } from "./visibilityQuery";
import { requiredFieldsSchema } from "./fields/validations";
import { saveVisibility } from "./visibilityApi";

export default function Visibility() {
    const navigate = useNavigate();
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

    function resetToSavedValues() {
        form.reset(query.data);
        form.clearErrors();
        setValidationErrors([]);
        setErrorMessage(undefined);
        setErrorDialogOpen(false);
    }

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
                        className={`flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[10px] border border-border bg-background shadow-blue transition-[flex-basis,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSettingsOpen
                            ? "absolute inset-y-0 left-0 z-50 w-full"
                            : "pointer-events-none absolute inset-y-0 left-0 z-50 w-full -translate-x-full"
                            } md:pointer-events-auto md:relative md:inset-auto md:z-auto md:w-auto md:shrink-0 md:self-stretch md:translate-x-0 ${isMaximized ? "md:basis-[70%]" : "md:basis-[30%] md:max-w-75"}`}
                    >
                        <header className="flex shrink-0 items-center justify-between border-b border-border px-3 py-3 sm:px-4">
                            <Button
                                variant="bare"
                                size="sm"
                                className="gap-1.5 text-foreground"
                                onClick={() => navigate("/chat-settings")}
                            >
                                <ArrowLeft className="size-4" />
                                Back
                            </Button>
                            <div className="flex items-center">
                                <Button
                                    variant="bare"
                                    size="sm"
                                    className="md:hidden"
                                    aria-label="Close settings"
                                    onClick={() => setIsSettingsOpen(false)}
                                >
                                    <X className="size-4" />
                                </Button>
                                <Button
                                    variant="bare"
                                    size="sm"
                                    className="hidden md:inline-flex"
                                    aria-label={isMaximized ? "Minimize settings panel" : "Maximize settings panel"}
                                    aria-pressed={isMaximized}
                                    onClick={() => setIsMaximized((current) => !current)}
                                >
                                    {isMaximized ? (
                                        <Minimize2 className="size-4" />
                                    ) : (
                                        <Maximize2 className="size-4" />
                                    )}
                                </Button>
                            </div>
                        </header>

                        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-3 sm:px-4">
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

                        <footer className="shrink-0 border-t border-border px-3 py-3 sm:px-4">
                            <Button
                                variant="secondary"
                                size="full"
                                onClick={resetToSavedValues}
                            >
                                Reset to default
                            </Button>
                        </footer>
                    </aside>

                    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                        <Button
                            variant="bare"
                            size="icon"
                            className="absolute top-3 left-3 z-30 border border-border bg-background/90 shadow-panel backdrop-blur-sm md:hidden"
                            aria-label="Open settings"
                            aria-expanded={isSettingsOpen}
                            onClick={() => setIsSettingsOpen(true)}
                        >
                            <PanelLeftOpen className="size-4" />
                        </Button>
                        <Preview />
                    </div>
                </div>

                <UnSavedChangesBar
                    isDirty={form.formState.isDirty}
                    onSave={async () => {
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
                            const savedData = await saveVisibility(data);
                            queryClient.setQueryData(visibilityQueryKey, savedData);
                            form.reset(savedData);
                        })();
                    }}
                    onDiscard={resetToSavedValues}
                    placement="inline"
                    edge="top"
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
