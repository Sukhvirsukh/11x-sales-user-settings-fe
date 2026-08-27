import { create } from "zustand";

export interface PromptTool {
  id: string;
  name: string;
  description: string;
  activated: boolean;
}

interface PromptToolsState {
  humanHelp: string;
  additionalInstruction: string;
  tools: PromptTool[];
  setHumanHelp: (value: string) => void;
  setAdditionalInstruction: (value: string) => void;
  toggleTool: (id: string) => void;
}

const initialTools: PromptTool[] = [
  {
    id: "knowledge-search",
    name: "Knowledge search",
    description: "Give Vitabl the ability to perform the functionality",
    activated: true,
  },
  {
    id: "escalate-conversations",
    name: "Escalate conversations",
    description: "Give Vitabl access to escalate conversations to your support team when needed",
    activated: false,
  },
  {
    id: "order-lookup",
    name: "Order lookup with custom API",
    description: "Give Vitabl the ability to provide information for the product order and delivery",
    activated: false,
  },
  {
    id: "skip-conversation",
    name: "Skip Conversation",
    description: "Give Vitabl the ability to skip conversation",
    activated: false,
  },
];

export const usePromptToolsStore = create<PromptToolsState>((set) => ({
  humanHelp: "",
  additionalInstruction:
    "Karl ai is a fashion brand that sells fashionable designer cloths across US. Its a luxury brand targeting Women",
  tools: initialTools,
  setHumanHelp: (value) => set({ humanHelp: value }),
  setAdditionalInstruction: (value) => set({ additionalInstruction: value }),
  toggleTool: (id) =>
    set((state) => ({
      tools: state.tools.map((tool) =>
        tool.id === id ? { ...tool, activated: !tool.activated } : tool
      ),
    })),
}));
