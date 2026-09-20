import { apiFetch } from "@/lib/api";
import type { OverviewResponse } from "./overviewType";

export async function getOverview(): Promise<OverviewResponse> {
    return apiFetch<OverviewResponse>("/overview");
}
