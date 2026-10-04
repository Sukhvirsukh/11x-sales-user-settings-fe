import { apiFetch } from "@/lib/api";
import { agentPath } from "@/features/agents/agentStore";
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


export async function getConfigurations() {
    const response = await apiFetch<Configuration>("/crawl-settings");
    return response
}

export async function saveConfigurations(values: Configuration) {
    const response = await apiFetch<Configuration>("/crawl-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });
    return response;
}

export async function getIntervals() {
    const response = await apiFetch<{ label: string; value: string }[]>("/crawl-settings/intervals");
    return response
}
