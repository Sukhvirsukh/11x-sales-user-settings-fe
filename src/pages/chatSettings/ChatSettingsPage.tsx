import { PageHeader } from "@/components/shared/PageHeader";
import Channels from "./tabs/Channels";
import Integrations from "./tabs/Integrations";
import Configurations from "./tabs/Configurations";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function ChatSettingsPage() {
  return (
    <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Chat settings"
        subtitle="Configure your chatbot"
        chatTitle="Settings Chat"
        chatPlaceholder="Ask about chat settings..."
      >
        <div className="mt-4 min-w-0 rounded-md border border-border bg-card px-3 sm:px-4">
          <Accordion defaultValue={["channels"]}>
            <AccordionItem value="channels">
              <AccordionTrigger>Channels</AccordionTrigger>
              <AccordionContent>
                <Channels />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="integration">
              <AccordionTrigger>Integration</AccordionTrigger>
              <AccordionContent>
                <Integrations />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="configurations">
              <AccordionTrigger>Configurations</AccordionTrigger>
              <AccordionContent>
                <Configurations />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </PageHeader>
    </div>
  );
}
