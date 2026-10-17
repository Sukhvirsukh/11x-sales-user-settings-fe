import { apiFetch } from "@/lib/api";
import { dateFormater } from "@/lib/utils";
import type { StoreData } from "./storeType";
import type { ApiAgent } from "@/features/auth/authTypes";
import { useAgentStore } from "@/features/agents/agentStore";
import { useAuthStore } from "@/features/auth/authStore";

function formatStore(store: StoreData): StoreData {
    const date = store.startDate ? new Date(store.startDate) : null;

    return {
        ...store,
        startDate: date && !Number.isNaN(date.getTime()) ? dateFormater(date) : "",
        startDateValue: date,
    };
}

interface ApiAgentRow {
    id: string;
    name: string;
    status: "active" | "paused" | "archived";
    role: "owner" | "editor" | "member";
    widgetAllowedOrigins: string[];
    createdAt: string;
}

/** Stores are the 11xSales backend's agents; the URL is the site the chat is allowed on. */
function toStoreData(agent: ApiAgentRow): StoreData {
    const { currentAgentId } = useAgentStore.getState();
    return formatStore({
        id: agent.id,
        name: agent.name,
        url: agent.widgetAllowedOrigins?.[0] ?? "",
        owner: agent.role === "owner" ? useAuthStore.getState().name ?? "You" : "Shared with you",
        status: agent.status === "active",
        isDefault: agent.id === currentAgentId,
        startDate: agent.createdAt,
    });
}

function originOf(url: string | undefined) {
    if (!url?.trim()) return [];
    try {
        return [new URL(/^https?:\/\//.test(url) ? url : `https://${url}`).origin];
    } catch {
        throw new Error("Enter a valid store URL, e.g. https://your-store.com");
    }
}

/** Keeps the store switcher in step after stores are added, renamed or removed. */
async function refreshSwitcher() {
    const agents = await apiFetch<ApiAgent[]>("/agents");
    const { currentAgentId, setAgents } = useAgentStore.getState();
    setAgents(agents, agents.some((a) => a.id === currentAgentId) ? currentAgentId : agents[0]?.id ?? null);
}

export async function getStores(): Promise<StoreData[]> {
    const agents = await apiFetch<ApiAgentRow[]>("/agents");
    return agents.map(toStoreData);
}

export async function createStore(store: Omit<StoreData, "id">) {
    const origins = originOf(String(store.url ?? ""));
    const agent = await apiFetch<ApiAgentRow>("/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: store.name }),
    });
    if (origins.length) await updateStore(agent.id, { url: String(store.url) });
    await refreshSwitcher();
    return agent;
}

export async function updateStore(id: string, store: Partial<StoreData>) {
    const body: Record<string, unknown> = {};
    if (store.name !== undefined) body.name = store.name;
    if (store.url !== undefined) body.widgetAllowedOrigins = originOf(String(store.url));
    if (store.status !== undefined) body.status = store.status ? "active" : "paused";
    const agent = await apiFetch<ApiAgentRow>(`/agents/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    await refreshSwitcher();
    return agent;
}

export async function deleteStore(id: string) {
    await apiFetch(`/agents/${encodeURIComponent(id)}`, { method: "DELETE" });
    await refreshSwitcher();
}

export async function deleteStores(ids: string[]) {
    for (const id of ids) await apiFetch(`/agents/${encodeURIComponent(id)}`, { method: "DELETE" });
    await refreshSwitcher();
}
