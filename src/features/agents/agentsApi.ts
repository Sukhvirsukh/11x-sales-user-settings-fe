import { apiFetch } from "@/lib/api";
import type { ApiAgent } from "@/features/auth/authTypes";

export function createAgent(name: string) {
    return apiFetch<ApiAgent>("/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
}

/** Opens an agent; the backend also remembers it as the user's last active agent. */
export function openAgent(agentId: string) {
    return apiFetch<ApiAgent>(`/agents/${encodeURIComponent(agentId)}`);
}
