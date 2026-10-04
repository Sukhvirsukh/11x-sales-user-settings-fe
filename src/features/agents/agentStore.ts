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
