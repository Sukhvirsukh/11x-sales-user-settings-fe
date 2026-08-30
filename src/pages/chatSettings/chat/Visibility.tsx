import { Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AllAccordions from "@/features/chatSettings/visibility/AllAccordions";
import { UnSavedChangesBar } from "@/components/shared/unSavedChanges";
import { useVisibilityStore } from "@/pages/chatSettings/store/chatVisibilityStore";
import { Preview } from "./Preview";

const PANEL_SHADOW = "shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.04)]";

export function Visibility() {
  const isDirty = useVisibilityStore((s) => s.isDirty);
  const save = useVisibilityStore((s) => s.save);
  const discard = useVisibilityStore((s) => s.discard);

  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden pt-[11px]">
      <div className="min-h-0 flex-1 overflow-hidden">
        <PageHeader
          title="Chat visibility"
          backTo="/chat-settings"
          chatTitle="Visibility Chat"
          chatPlaceholder="Ask about chat visibility..."
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
            {/* Sidebar */}
            <aside
              className={`
                h-fit max-h-full min-w-0 shrink-0 overflow-y-auto
                transition-[flex-basis,width]
                duration-300
                ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isMaximized
                  ? "lg:basis-[calc((100%-1rem)*0.6)]"
                  : "w-full lg:w-[280px] xl:w-[320px]"
                }
              `}
            >
              <div
                className={`
                  h-fit min-w-0 rounded-md bg-card
                  px-3 sm:px-4
                  ${PANEL_SHADOW}
                `}
              >
                <Accordion>
                  {AllAccordions.map((tab) => (
                    <AccordionItem key={tab.id} value={tab.id}>
                      <AccordionTrigger className="py-4 text-body font-bold text-foreground">
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
                    flex min-h-[320px] min-w-0 flex-col
                    overflow-hidden rounded-[10px]
                    border border-border bg-card
                    transition-[width]
                    duration-400
                    ease-in-out
                    ${isMaximized
                  ? "lg:basis-[calc((100%-1rem)*0.4)] lg:flex-none"
                  : "flex-1"
                }
                    ${PANEL_SHADOW}
                  `}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h2 className="text-title font-semibold text-foreground">
                  Preview
                </h2>

                <button
                  type="button"
                  aria-label={
                    isMaximized ? "Minimize preview" : "Expand preview"
                  }
                  onClick={() => setIsMaximized((prev) => !prev)}
                  className="
                        flex h-8 w-8 items-center justify-center
                        rounded-md text-muted-foreground
                        transition-colors duration-150
                        hover:bg-muted hover:text-foreground
                      "
                >
                  {isMaximized ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="min-h-0 flex-1 p-3">
                <Preview />
              </div>
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
  );
}

export default Visibility;