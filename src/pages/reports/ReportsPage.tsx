import { PageHeader } from "@/components/shared/pageHeader";

export function ReportsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6">
        <PageHeader title="Reports" subtitle="Analytics and reports" />
        <p className="mt-4 text-sm text-muted-foreground">
          Reports dashboard coming soon.
        </p>
      </div>
    </div>
  );
}
