import { PageHeader } from "@/components/shared/PageHeader";
import { UnSavedChangesBar } from "@/components/shared/unsavedChangesBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import allAccordions from "@/features/visibility/AllAccordions";
import Preview from "@/features/visibility/preview/Preview";
import { useState } from "react";
import { useVisibilityStore } from "@/components/shared/chatBox/store/chatVisibilityStore";

export default function Visibility() {
    const isDirty = useVisibilityStore((s) => s.isDirty);
    const save = useVisibilityStore((s) => s.save);
    const discard = useVisibilityStore((s) => s.discard);

    const [isMaximized, setIsMaximized] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-hidden">
                <PageHeader
                    title="Chat visibility"
                    backTo="/chat-settings"
                >
                    <div className="relative flex min-h-0 flex-1 flex-row items-stretch gap-4">
                        {isSettingsOpen && (
                            <button
                                type="button"
                                aria-label="Close settings"
                                className="absolute inset-0 z-40 bg-muted/80 md:hidden"
                                onClick={() => setIsSettingsOpen(false)}
                            />
                        )}

                        {/* Settings panel */}
                        <aside
                            className={`min-h-0 min-w-0 overflow-y-auto transition-[flex-basis,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                                            ${isSettingsOpen ? "absolute inset-y-0 left-0 z-50 w-[min(92vw,360px)]"
                                    : "pointer-events-none absolute inset-y-0 left-0 z-50 w-[min(92vw,360px)] -translate-x-full"
                                }
                                    md:pointer-events-auto md:relative md:inset-auto md:z-auto md:block md:h-full md:w-auto md:shrink-0 md:translate-x-0 
                                    ${isMaximized ? "md:basis-[70%]" : "md:basis-[30%] md:max-w-75"}
                            `}
                        >
                            <div className="h-fit min-h-full min-w-0 rounded-[10px] border border-border bg-background px-3 shadow-panel sm:px-4 md:min-h-0">
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

                        {/* Preview */}
                        <div
                            className={`
                                    flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-border bg-card shadow-panel transition-[flex-basis] duration-300 ease-in-out
                                    ${isMaximized ? "md:basis-[30%] md:flex-none" : "min-w-0 flex-1"}
                        `}
                        >
                            <Preview
                                isMaximized={isMaximized}
                                onToggleMaximize={() =>
                                    setIsMaximized((prev) => !prev)
                                }
                                isSettingsOpen={isSettingsOpen}
                                onToggleSettings={() =>
                                    setIsSettingsOpen((prev) => !prev)
                                }
                            />
                        </div>
                    </div>
                </PageHeader>
            </div>

            <UnSavedChangesBar
                isDirty={isDirty}
                onSave={save}
                onDiscard={discard}
                placement="fixed"
            />
        </section>
    )
}
