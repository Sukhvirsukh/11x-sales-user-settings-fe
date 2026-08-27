import { PageHeader } from "@/components/shared/pageHeader";

export function AskPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6">
        <PageHeader title="Ask me anything" subtitle="AI-powered assistance" />
        <p className="mt-4 text-sm text-gray-500">
          AI assistant coming soon.
        </p>
      </div>
    </div>
  );
}
