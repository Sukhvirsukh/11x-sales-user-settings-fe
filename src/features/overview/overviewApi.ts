import { apiFetch } from "@/lib/api";
import { agentApiConfigured, agentFetch } from "@/lib/agentApi";
import type { OverviewResponse } from "./overviewType";

// The AI agent has the real conversation, order and action numbers; the main
// API's /overview only returns placeholder figures.
export async function getOverview(): Promise<OverviewResponse> {
    return agentApiConfigured ? agentFetch<OverviewResponse>("/overview") : apiFetch<OverviewResponse>("/overview");
}
