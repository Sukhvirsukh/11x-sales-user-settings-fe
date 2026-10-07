import { apiFetch } from "@/lib/api";
import { agentPath } from "@/features/agents/agentStore";
import { agentFetch } from "@/lib/agentApi";
import type { Configuration, IntegrationResponse } from "./chatSettingsType";


export async function getIntegrations() {
    return apiFetch<IntegrationResponse>(agentPath("/integrations"));
}

/** Where to send the browser to approve the app in the store's Shopify admin. */
export async function connectShopify(shop: string) {
    return apiFetch<{ shop: string; authorizeUrl: string }>(agentPath("/integrations/shopify/connect"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop }),
    });
}

export async function disconnectShopify() {
    return apiFetch<IntegrationResponse>(agentPath("/integrations/shopify"), { method: "DELETE" });
}


// Crawl and spam-filter settings belong to the AI agent ("crawl" in its settings).
// "Over a period of" is the rate-limit window; the agent stores it in minutes.
const INTERVALS = [
    { value: "ONE_MINUTE", label: "1 Minute", minutes: 1 },
    { value: "FIFTEEN_MINUTES", label: "15 Minutes", minutes: 15 },
    { value: "THIRTY_MINUTES", label: "30 Minutes", minutes: 30 },
    { value: "ONE_HOUR", label: "1 Hour", minutes: 60 },
    { value: "THREE_HOURS", label: "3 Hours", minutes: 180 },
    { value: "SIX_HOURS", label: "6 Hours", minutes: 360 },
    { value: "TWELVE_HOURS", label: "12 Hours", minutes: 720 },
    { value: "ONE_DAY", label: "1 Day", minutes: 1440 },
    { value: "ONE_WEEK", label: "1 Week", minutes: 10080 },
];

type AgentCrawl = {
    ignoreProducts: boolean;
    ignoreElements: string[];
    rateLimit: number | null;
    rateLimitPeriodMinutes: number | null;
    messageWhenLimitReached: string | null;
    enableUtmTracking: boolean;
};

function toConfiguration(crawl: AgentCrawl): Configuration {
    const period = INTERVALS.find((i) => i.minutes === crawl.rateLimitPeriodMinutes) ?? INTERVALS[3];
    return {
        // Discontinued products are never synced, so "out-of-stock" means: also skip out-of-stock ones.
        ignoreProducts: crawl.ignoreProducts ? "out-of-stock" : "discontinued",
        ignoreElements: crawl.ignoreElements ?? [],
        crawlInterval: period.value,
        rateLimit: crawl.rateLimit,
        rateLimitPerPeriod: null,
        messageWhenLimitReached: crawl.messageWhenLimitReached,
        enableUtmTracking: crawl.enableUtmTracking,
    };
}

export async function getConfigurations() {
    const settings = await agentFetch<{ crawl: AgentCrawl }>("/settings");
    return toConfiguration(settings.crawl);
}

export async function saveConfigurations(values: Configuration) {
    const crawl: Partial<AgentCrawl> = {
        ignoreProducts: values.ignoreProducts === "out-of-stock",
        ignoreElements: values.ignoreElements,
        rateLimit: values.rateLimit,
        rateLimitPeriodMinutes: INTERVALS.find((i) => i.value === values.crawlInterval)?.minutes ?? 60,
        messageWhenLimitReached: values.messageWhenLimitReached,
        enableUtmTracking: values.enableUtmTracking,
    };
    const settings = await agentFetch<{ crawl: AgentCrawl }>("/settings", { method: "PUT", body: { crawl } });
    return toConfiguration(settings.crawl);
}

export async function getIntervals() {
    return INTERVALS.map(({ value, label }) => ({ value, label }));
}
