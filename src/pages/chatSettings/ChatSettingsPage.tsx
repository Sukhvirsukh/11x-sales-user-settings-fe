import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SettingsAccordion } from "@/features/chatSettings/SettingsAccordion";
import Channels from "./tabs/Channels";
import Integrations from "./tabs/Integrations";
import Configurations from "./tabs/Configurations";

export function ChatSettingsPage() {
  const [openSection, setOpenSection] = useState<string | null>("channels");

  const handleToggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Chat settings"
        subtitle="Configure your chatbot"
        chatTitle="Settings Chat"
        chatPlaceholder="Ask about chat settings..."
      >
        <div className="mt-4 min-w-0 rounded-md border border-border bg-card px-3 sm:px-4">
          <SettingsAccordion
            title="Channels"
            open={openSection === "channels"}
            onToggle={() => handleToggle("channels")}
          >
            <Channels />
          </SettingsAccordion>

          <SettingsAccordion
            title="Integration"
            open={openSection === "integration"}
            onToggle={() => handleToggle("integration")}
          >
            <Integrations />
          </SettingsAccordion>

          <SettingsAccordion
            title="Configurations"
            open={openSection === "configurations"}
            onToggle={() => handleToggle("configurations")}
            showDivider={false}
          >
            <Configurations />
          </SettingsAccordion>
        </div>
      </PageHeader>
    </div>
  );
}
