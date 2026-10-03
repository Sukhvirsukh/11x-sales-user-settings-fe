import { create } from "zustand";

interface AgentState {
    selectedAgentId: string | null;
    setSelectedAgentId: (agentId: string | null) => void;
    reset: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
    selectedAgentId: null,
    setSelectedAgentId: (agentId) => set({ selectedAgentId: agentId }),
    reset: () => set({ selectedAgentId: null }),
}));
