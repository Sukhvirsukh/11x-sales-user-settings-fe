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
    <div className="flex-1 overflow-y-auto">
      <PageHeader
        title="Chat settings"
        subtitle="Configure your chatbot"
        chatTitle="Settings Chat"
        chatPlaceholder="Ask about chat settings..."
      >
        <div className="mt-4 rounded-md border border-[#E6E6E8] bg-white">
          <Collapsible open={openSection === "channels"} className="border-b border-[#E6E6E8] mx-4">
            <CollapsibleTrigger
              onClick={() => handleToggle("channels")}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[#111113] cursor-pointer"
            >
              Channels
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 text-[#6D6D76] transition-transform duration-200",
                  openSection === "channels" && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-[#F1F1F1] mb-4 p-4 rounded-md">
              <Channels />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openSection === "integration"} className="border-b border-[#E6E6E8] mx-4">
            <CollapsibleTrigger
              onClick={() => handleToggle("integration")}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[#111113] cursor-pointer"
            >
              Integration
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 text-[#6D6D76] transition-transform duration-200",
                  openSection === "integration" && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-[#F1F1F1] mb-4 p-4 rounded-md">
              <Integrations />
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openSection === "configurations"} className="mx-4">
            <CollapsibleTrigger
              onClick={() => handleToggle("configurations")}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[#111113] cursor-pointer"
            >
              Configurations
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 text-[#6D6D76] transition-transform duration-200",
                  openSection === "configurations" && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-[#F1F1F1] mb-4 p-4 rounded-md">
              <Configurations />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </PageHeader>
    </div>
  );
}
