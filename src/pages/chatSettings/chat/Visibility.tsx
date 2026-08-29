import { Maximize2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AllAccordions from "@/features/chatSettings/visibility/AllAccordions";
import { UnSavedChangesBar } from "@/components/shared/unSavedChanges";
import { useVisibilityStore } from "@/pages/chatSettings/store/chatVisibility";

export function Visibility() {
  const isDirty = useVisibilityStore((s) => s.isDirty);
  const save = useVisibilityStore((s) => s.save);
  const discard = useVisibilityStore((s) => s.discard);

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
            <aside className="h-fit max-h-full w-full shrink-0 overflow-y-auto lg:w-[280px] xl:w-[320px]">
              <div className="h-fit min-w-0 rounded-md bg-card px-3 sm:px-4">
                <Accordion className="">
                  {AllAccordions.map((tab) => (
                    <AccordionItem key={tab.id} value={tab.id}>
                      <AccordionTrigger className="text-body font-bold text-foreground py-4">{tab.label}</AccordionTrigger>
                      <AccordionContent>
                        <tab.content />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </aside>

            <div className="flex min-h-[320px] min-w-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-border bg-card">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-title font-semibold text-foreground">Preview</h2>
                <button
                  type="button"
                  aria-label="Expand preview"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1 px-4 pb-4">
                <div className="h-full min-h-[240px] rounded-[8px] border border-border bg-background" />
              </div>
            </div>
          </div>
        </PageHeader>
      </div>

      <UnSavedChangesBar
        isDirty={isDirty}
        onSave={save}
        onDiscard={discard}
      />
    </section>
  );
}

export default Visibility;
