import { apiFetch } from "@/lib/api";
import type { OverviewResponse } from "./overviewType";

export async function getOverview(agentId: string, signal?: AbortSignal): Promise<OverviewResponse> {
    const params = new URLSearchParams({ agentId });
    return apiFetch<OverviewResponse>(`/overview?${params.toString()}`, { signal });
}
