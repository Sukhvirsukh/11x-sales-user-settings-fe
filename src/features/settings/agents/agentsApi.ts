import { apiFetch } from "@/lib/api";
import { dateFormater } from "@/lib/utils";
import type { AgentData, AgentListResponse, AgentResponse } from "./agentType";
import type { AgentFilters } from "./agentsFilters";

function formatAgent(agent: AgentData): AgentData {
    const date = agent.startDate ? new Date(agent.startDate) : null;

    return {
        ...agent,
        startDate: date && !Number.isNaN(date.getTime()) ? dateFormater(date) : "",
        startDateValue: date,
    };
}

export async function getAgents({ search, status, createdAtFrom, createdAtTo }: AgentFilters, cursor?: string) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (cursor) params.set("cursor", cursor);
    if (status) params.set("status", status);
    if (createdAtFrom) params.set("createdAtFrom", createdAtFrom);
    if (createdAtTo) params.set("createdAtTo", createdAtTo);
    const query = params.toString();
    const response = await apiFetch<AgentListResponse>(`/admin/stores${query ? `?${query}` : ""}`);
    return { ...response, items: response.items.map(formatAgent) };
}

export function createAgent(agent: Omit<AgentData, "id">) {
    return apiFetch<AgentResponse>("/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agent),
    });
}

export function updateAgent(id: string, agent: Partial<AgentData>) {
    return apiFetch<AgentResponse>(`/admin/stores/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agent),
    });
}

export function deleteAgent(id: string) {
    return apiFetch<AgentResponse>(`/admin/stores/${id}`, {
        method: "DELETE",
    });
}

export function deleteAgents(ids: string[]) {
    return apiFetch<unknown>("/admin/stores/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
    });
}