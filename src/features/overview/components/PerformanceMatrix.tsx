import { useState } from "react";

import AppCard from "@/components/design/AppCard";
import { CustomTabs } from "@/components/design/CustomTabs";
import AppSection from "@/components/design/AppSectoin";
import { Button } from "@/components/ui/button";
import Heading from "@/components/design/Heading";


const tabs = [
    { id: "revenue-actions", label: "Revenue actions" },
    { id: "support-actions", label: "Support actions" },
    { id: "escalation-actions", label: "Escalation actions" },
];

const metrics = {
    "revenue-actions": [
        { name: "Create discount", value: "12.8%" },
        { name: "Abandoned Cart Recovery", value: "15%" },
        { name: "Upsell recommendation", value: "9.4%" },
    ],
    "support-actions": [
        { name: "Order status resolution", value: "28.6%" },
        { name: "Return request handling", value: "18.2%" },
        { name: "Product information", value: "14.7%" },
    ],
    "escalation-actions": [
        { name: "Human agent handoff", value: "8.4%" },
        { name: "Priority issue routing", value: "5.9%" },
        { name: "Complaint escalation", value: "4.2%" },
    ],
} as const;

export default function PerformanceMatrix() {

    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    return (
        <AppCard
            shadow
            header="Performance metrics"
            headingSize="lg"
        >
            <CustomTabs
                tabs={tabs}
                value={activeTab}
                onValueChange={handleTabChange}
                className="gap-4"
                listClassName="!h-auto grid w-full grid-cols-3 gap-2 border-b border-border"
                triggerClassName="h-auto min-w-0 rounded-none px-0 pb-2 text-sm text-ghost hover:bg-transparent focus-visible:!border-transparent focus-visible:!ring-0 focus-visible:!outline-none data-active:!border-x-0 data-active:!border-t-0 data-active:!border-b-2 data-active:!border-primary data-active:!bg-transparent data-active:!shadow-none data-active:!font-normal after:!bottom-[-1px] after:!bg-primary"
                contentClassName="mt-0"
            >
                <div className="space-y-2">
                    {metrics[activeTab as keyof typeof metrics].map((metric) => (
                        <AppSection
                            key={metric.name}
                            className="gap-2.5"
                        >
                            <div className="flex w-full items-start justify-between gap-6">
                                <span className="min-w-0 flex-1 text-base text-foreground">
                                    {metric.name}
                                </span>
                                <Heading size="lg" className="shrink-0 whitespace-nowrap">
                                    {metric.value}
                                </Heading>
                            </div>
                            <Button variant='ghost' size='sm' className="px-2.5! py-1.5! text-xs">
                                Enabled
                            </Button>
                        </AppSection>
                    ))}
                </div>
            </CustomTabs>
        </AppCard>
    )
}
