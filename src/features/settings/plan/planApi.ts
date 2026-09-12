import { apiFetch } from "@/lib/api";
import type { PlanResponse } from "./planTypes";




export async function getPlans() {
    const response = await apiFetch<PlanResponse>("/admin/plans");

    return response;
}

export function upgradePlan(planId: string) {
    return apiFetch<unknown>(`/admin/plans/${encodeURIComponent(planId)}/upgrade`, {
        method: "POST",
    });
}

