import { apiFetch } from "@/lib/api";
import type { KnowledgeBaseResponse } from "./knowledgeBaseTypes";
import type { KnowledgeBaseFormValues } from "./knowledgeBaseSchema";


export async function getKnowledgeBase(page = 1) {
    const response = await apiFetch<KnowledgeBaseResponse>(`/training/pages?page=${page}`);
    return response
}

export async function updateKnowledgeBase({ id, name, format, url, file, text }: KnowledgeBaseFormValues & { id?: string }) {
    const isDocument = format === "Doc" || format === "Pdf" || format === "Csv";
    const isText = format === "Text";
    let body: FormData | string;

    if (isDocument) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("format", format);
        if (file instanceof File) formData.append("file", file);
        // if (id) formData.append("id", id);
        body = formData;
    } else if (isText) {
        console.log({ name, format, text })
        body = JSON.stringify({ name, format, text });
    } else {
        body = JSON.stringify({ name, format, url });
    }

    const URL = id ? `/training/pages/${id}` : "/training/pages";

    return apiFetch<KnowledgeBaseResponse>(URL, {
        method: id ? "PATCH" : "POST",
        headers: isDocument ? undefined : { "Content-Type": "application/json" },
        body,
    });
}

export async function deleteKnowledgeBase(ids: string[]) {
    const response = await apiFetch<KnowledgeBaseResponse>("/training/pages/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
    });
    return response
}


export async function searchKnowledge(search: string, page = 1) {
    const response = await apiFetch<KnowledgeBaseResponse>(`/training/pages?search=${search}&page=${page}`);
    return response
}
