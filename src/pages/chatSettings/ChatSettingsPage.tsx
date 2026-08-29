import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Channels from "./tabs/Channels";
import Integrations from "./tabs/Integrations";
import Configurations from "./tabs/Configurations";

export function ChatSettingsPage() {
  const [openSection, setOpenSection] = useState<string | null>("channels");

  const handleToggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-w-0 flex-1 overflow-y-auto">
      <PageHeader
        title="Chat settings"
        subtitle="Configure your chatbot"
        chatTitle="Settings Chat"
        chatPlaceholder="Ask about chat settings..."
      >
        <div className="mt-4 overflow-hidden rounded-md border border-border bg-card">
          <Collapsible open={openSection === "channels"} className="mx-2 border-b border-border sm:mx-4">
            <CollapsibleTrigger
              onClick={() => handleToggle("channels")}
              className="flex w-full cursor-pointer items-center justify-between px-2 py-3 text-left text-sm font-medium text-foreground sm:px-4"
            >
              Channels
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  openSection === "channels" && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mb-4 rounded-md bg-surface-inset p-2 sm:p-4">
              <Channels />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openSection === "integration"} className="mx-2 border-b border-border sm:mx-4">
            <CollapsibleTrigger
              onClick={() => handleToggle("integration")}
              className="flex w-full cursor-pointer items-center justify-between px-2 py-3 text-left text-sm font-medium text-foreground sm:px-4"
            >
              Integration
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  openSection === "integration" && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mb-4 rounded-md bg-surface-inset p-2 sm:p-4">
              <Integrations />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openSection === "configurations"} className="mx-2 sm:mx-4">
            <CollapsibleTrigger
              onClick={() => handleToggle("configurations")}
              className="flex w-full cursor-pointer items-center justify-between px-2 py-3 text-left text-sm font-medium text-foreground sm:px-4"
            >
              Configurations
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  openSection === "configurations" && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mb-4 rounded-md bg-surface-inset p-2 sm:p-4">
              <Configurations />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </PageHeader>
    </div>
  );
}
