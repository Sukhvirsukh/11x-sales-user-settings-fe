import { create } from "zustand";
import type { ApiAgent } from "@/features/auth/authTypes";
import { storeAgentId } from "@/features/auth/authStorage";

interface AgentStore {
    /** Agents (stores) the signed-in user can access. */
    agents: ApiAgent[];
    /** The agent the whole dashboard is showing. */
    currentAgentId: string | null;
    setAgents: (agents: ApiAgent[], currentAgentId: string | null) => void;
    clear: () => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
    agents: [],
    currentAgentId: null,
    setAgents: (agents, currentAgentId) => {
        storeAgentId(currentAgentId);
        set({ agents, currentAgentId });
    },
    clear: () => {
        storeAgentId(null);
        set({ agents: [], currentAgentId: null });
    },
}));

export function getCurrentAgentId() {
    return useAgentStore.getState().currentAgentId;
}

/** "/agents/<current agent>/<path>": endpoints scoped to the store the dashboard is showing. */
export function agentPath(path: string) {
    const agentId = getCurrentAgentId();
    if (!agentId) throw new Error("No store selected.");
    return `/agents/${encodeURIComponent(agentId)}${path}`;
}
