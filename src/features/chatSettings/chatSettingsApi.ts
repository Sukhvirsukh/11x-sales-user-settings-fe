import { apiFetch } from "@/lib/api";
import type { Configuration, IntegrationResponse } from "./chatSettingsType";


export async function getIntegrations() {
    const response = await apiFetch<IntegrationResponse>("/integrations");
    return response
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
