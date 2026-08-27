import { PageHeader } from "@/components/shared/pageHeader";

export function ChatSettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6">
        <PageHeader title="Chat settings" subtitle="Configure your chatbot" />
        <p className="mt-4 text-sm text-gray-500">
          Chat settings coming soon.
        </p>
      </div>
    </div>
  );
}
