import { PageHeader } from "@/components/shared/pageHeader";

export function HelpPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6">
        <PageHeader title="Help & support" subtitle="Get help and support" />
        <p className="mt-4 text-sm text-muted-foreground">
          Help center coming soon.
        </p>
      </div>
    </div>
  );
}
