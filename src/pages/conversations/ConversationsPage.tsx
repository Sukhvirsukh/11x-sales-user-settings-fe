import { PageHeader } from "@/components/shared/pageHeader";

export function ConversationsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6">
        <PageHeader title="Conversations" subtitle="View chat conversations" />
        <p className="mt-4 text-sm text-gray-500">
          Conversations view coming soon.
        </p>
      </div>
    </div>
  );
}
