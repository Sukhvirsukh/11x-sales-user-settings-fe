import { apiFetch } from "@/lib/api";
import type { KnowledgeBaseResponse } from "./knowledgeBaseTypes";
import type { KnowledgeBaseFormValues } from "./knowledgeBaseSchema";


export async function getKnowledgeBase(page = 1) {
    const response = await apiFetch<KnowledgeBaseResponse>(`/training/pages?page=${page}`);
    return response
}

export async function updateKnowledgeBase(values: KnowledgeBaseFormValues & { id?: string }) {
    const response = await apiFetch<KnowledgeBaseResponse>("/training/pages", {
        method: values.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });
    return response
}

export async function deleteKnowledgeBase(ids: string[]) {
    const response = await apiFetch<KnowledgeBaseResponse>("/training/pages/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
    });
    return response
}
