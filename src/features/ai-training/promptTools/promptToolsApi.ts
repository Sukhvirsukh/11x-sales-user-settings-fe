import { apiFetch } from "@/lib/api";
import type { PromptToolsFormValues, PromptToolsResponse } from "./promptType";

export async function getPromptTools() {
    return apiFetch<PromptToolsResponse>("/training/prompt-tools");
}

export async function savePromptTools(values: PromptToolsFormValues) {
    return apiFetch<PromptToolsResponse>("/training/prompt-tools", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });
}
