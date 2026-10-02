import { apiFetch } from "@/lib/api";
import type { KnowledgeBaseResponse } from "./knowledgeBaseTypes";
import type { KnowledgeBaseFormValues } from "./knowledgeBaseSchema";
import type { KnowledgeBaseFilters } from "./knowledgeBaseFilters";


export async function getKnowledgeBase({ search, status, format, createdAtFrom, createdAtTo, lastUpdatedFrom, lastUpdatedTo }: KnowledgeBaseFilters, cursor?: string) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (cursor) params.set("cursor", cursor);
    if (status) params.set("status", status);
    if (format.length) params.set("format", format.join(","));
    if (createdAtFrom) params.set("createdAtFrom", createdAtFrom);
    if (createdAtTo) params.set("createdAtTo", createdAtTo);
    if (lastUpdatedFrom) params.set("lastUpdatedFrom", lastUpdatedFrom);
    if (lastUpdatedTo) params.set("lastUpdatedTo", lastUpdatedTo);
    const query = params.toString();
    return apiFetch<KnowledgeBaseResponse>(`/training${query ? `?${query}` : ""}`);
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

    const URL = id ? `/training/${id}` : "/training";

    return apiFetch<KnowledgeBaseResponse>(URL, {
        method: id ? "PATCH" : "POST",
        headers: isDocument ? undefined : { "Content-Type": "application/json" },
        body,
    });
}

export async function deleteKnowledgeBase(ids: string[]) {
    const response = await apiFetch<KnowledgeBaseResponse>("/training/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
    });
    return response
}
