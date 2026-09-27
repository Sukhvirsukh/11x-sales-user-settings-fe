import { apiFetch } from "@/lib/api";
import type { PromptToolsApiResponse, PromptToolsFormValues, PromptToolsResponse } from "./promptType";

function formatResponse(response: PromptToolsApiResponse): PromptToolsResponse {
    return {
        ...response,
        humanHelpSupport: response.humanHelpSupport,
        additionalInstructions: response.additionalInstructions,
        knowledgeSearchEnabled: response.tools?.knowledgeSearch?.enabled ?? false,
        escalateConversationsEnabled: response.tools?.escalateConversations?.enabled ?? false,
        orderLookupEnabled: response.tools?.orderLookup?.enabled ?? false,
        skipConversationEnabled: response.tools?.skipConversation?.enabled ?? false,
    };
}

export async function getPromptTools() {
    const response = await apiFetch<PromptToolsApiResponse>("/training/prompt-tools");
    return formatResponse(response);
}

export async function savePromptTools(values: PromptToolsFormValues) {
    const response = await apiFetch<PromptToolsApiResponse>("/training/prompt-tools", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });
    return formatResponse(response);
}
