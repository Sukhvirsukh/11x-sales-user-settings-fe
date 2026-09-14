import { apiFetch } from "@/lib/api";
import type { IntegrationResponse } from "./chatSettingsType";


export async function getIntegrations() {
    const response = await apiFetch<IntegrationResponse>("/integrations");
    return response
}
