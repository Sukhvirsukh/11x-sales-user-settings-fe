import { apiFetch } from "@/lib/api";


export async function getIntegrations() {
    const response = await apiFetch<IntegrationResponse>("/integrations");
    return response
}
