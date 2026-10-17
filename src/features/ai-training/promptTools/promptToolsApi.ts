import { agentFetch } from "@/lib/agentApi";
import type { PromptToolsFormValues, PromptToolsResponse } from "./promptType";

// Prompt tools belong to the AI agent's own settings.
type AgentSettings = { promptTools: PromptToolsResponse };

export async function getPromptTools() {
    const settings = await agentFetch<AgentSettings>("/settings");
    return settings.promptTools;
}

export async function savePromptTools(values: PromptToolsFormValues) {
    const settings = await agentFetch<AgentSettings>("/settings", { method: "PUT", body: { promptTools: values } });
    return settings.promptTools;
}
