import { PageHeader } from "@/components/shared/pageHeader";

export function OverviewPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6">
        <PageHeader title="Overview" subtitle="Your dashboard at a glance" />
        <p className="mt-4 text-sm text-muted-foreground">
          Welcome to the overview dashboard.
        </p>
      </div>
    </div>
  );
}
