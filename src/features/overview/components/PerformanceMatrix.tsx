import { useState } from "react";

import AppCard from "@/components/design/AppCard";
import { CustomTabs } from "@/components/design/CustomTabs";
import AppSection from "@/components/design/AppSectoin";
import { Button } from "@/components/ui/button";
import Heading from "@/components/design/Heading";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";
import type { PerformanceMetric, PerformanceMetricsSummary } from "../overviewType";

function PerformanceMatrixTabs(metrics: PerformanceMetricsSummary) {
    const [activeTab, setActiveTab] = useState(metrics.activeTab);

    // The API identifies tabs by their label, so the label doubles as the tab id.
    const tabs = metrics.tabs.map((label) => ({ id: label, label }));
    const selectedTab = metrics.tabs.includes(activeTab) ? activeTab : metrics.tabs[0];

    const metricsByTab: Record<string, PerformanceMetric[]> = {
        "Revenue actions": metrics.revenueActions,
        "Support actions": metrics.supportActions,
        "Escalation actions": metrics.escalationActions,
    };
    const rows = metricsByTab[selectedTab] ?? [];

    return (
        <>
            <Heading>Actions by the agent</Heading>
            <CustomTabs
                tabs={tabs}
                value={selectedTab}
                onValueChange={setActiveTab}
                className="w-full gap-4"
                listClassName="gap-4"
                triggerClassName="text-sm"
                contentClassName="mt-0"
            >
                <div className="space-y-2">
                    {rows.length === 0 ? (
                        <p className="text-sm text-content-muted">No actions for this tab yet.</p>
                    ) : (
                        rows.map((metric) => (
                            <AppCard
                                key={metric.name}
                                shadow={false}
                                padding="sm"
                            >
                                <div className="flex w-full items-start justify-between gap-6 mb-1.5">
                                    <span className="min-w-0 flex-1 text-base text-foreground">
                                        {metric.name}
                                    </span>
                                    <Heading size="lg" className="shrink-0 whitespace-nowrap">
                                        {formatNumber(metric.rate, "percent")}
                                    </Heading>
                                </div>
                                <Button variant='ghost' size='sm' className="px-2.5! py-1.5! text-xs">
                                    {metric.status}
                                </Button>
                            </AppCard>
                        ))
                    )}
                </div>
            </CustomTabs>
        </>
    );
}

interface PerformanceMatrixProps {
    /** `performanceMetrics` section of the Overview response. */
    panel?: PerformanceMetricsSummary;
    /** True while the Overview request is in flight. */
    isLoading?: boolean;
}

export default function PerformanceMatrix({ panel, isLoading = false }: PerformanceMatrixProps) {
    if (isLoading) {
        return (
            <AppSection className="h-auto">
                <Skeleton className="h-64 w-full" />
            </AppSection>
        );
    }

    if (!panel || panel.tabs.length === 0) {
        return (
            <AppSection className="h-auto">
                <p className="flex h-64 w-full items-center justify-center text-sm text-content-muted">
                    No performance data yet.
                </p>
            </AppSection>
        );
    }

    return (
        <AppSection className="h-auto">
            <PerformanceMatrixTabs {...panel} />
        </AppSection>
    );
}
