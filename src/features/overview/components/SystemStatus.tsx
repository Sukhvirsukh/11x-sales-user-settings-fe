import type { ComponentProps } from "react";
import { Bot, Download, MessagesSquare, Sparkles, type LucideIcon } from "lucide-react";

import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { SystemStatusAgent, SystemStatusSummary } from "../overviewType";

type StatusVariant = NonNullable<ComponentProps<typeof Badge>["variant"]>;

/** Agent icons, keyed by the `icon` value the API sends. */
const AGENT_ICONS: Record<string, LucideIcon> = {
    chat: MessagesSquare,
    sparkle: Sparkles,
    download: Download,
};

/** Status label -> badge tone. Unknown statuses fall back to the muted tone. */
const STATUS_VARIANTS: Record<string, StatusVariant> = {
    Active: "darkSuccess",
    Learning: "warning",
    "Not installed": "darkOutline",
};

const FALLBACK_STATUS_VARIANT: StatusVariant = "darkOutline";

function AgentRow({ name, icon, status }: SystemStatusAgent) {
    const Icon = AGENT_ICONS[icon] ?? Bot;

    return (
        <div className="mt-2.5 flex items-center justify-between first:mt-0">
            <div className="flex gap-2">
                <Icon size={16} />
                <span>{name}</span>
            </div>
            <Badge variant={STATUS_VARIANTS[status] ?? FALLBACK_STATUS_VARIANT}>{status}</Badge>
        </div>
    );
}

function AgentList({ agents }: SystemStatusSummary) {
    return (
        <AppCard shadow={false} padding="sm">
            <div className="w-full">
                <div className="border-b border-border flex items-center justify-between w-full py-1.5">
                    <p className="block text-sm font-semibold">Agent Name</p>
                    <p className="block text-sm font-semibold">Actions</p>
                </div>
                <div className="py-2">
                    {agents.map((agent) => (
                        <AgentRow key={agent.name} {...agent} />
                    ))}
                </div>
            </div>
        </AppCard>
    );
}

interface SystemStatusProps {
    /** `systemStatus` section of the Overview response. */
    panel?: SystemStatusSummary;
    /** True while the Overview request is in flight. */
    isLoading?: boolean;
}

export default function SystemStatus({ panel, isLoading = false }: SystemStatusProps) {
    if (isLoading) {
        return (
            <AppSection className="h-auto">
                <Skeleton className="h-40 w-full" />
            </AppSection>
        );
    }

    if (!panel || panel.agents.length === 0) {
        return (
            <AppSection className="h-auto">
                <p className="flex h-40 w-full items-center justify-center text-sm text-content-muted">
                    No system status data.
                </p>
            </AppSection>
        );
    }

    return (
        <AppSection className="h-auto">
            <Heading>System Status</Heading>
            <AgentList {...panel} />
        </AppSection>
    );
}
