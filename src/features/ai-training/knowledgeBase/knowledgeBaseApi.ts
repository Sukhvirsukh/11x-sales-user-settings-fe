import { agentFetch } from "@/lib/agentApi";
import type { KnowledgeBase, KnowledgeBaseResponse } from "./knowledgeBaseTypes";
import type { KnowledgeBaseFormValues } from "./knowledgeBaseSchema";

// The knowledge base is the AI agent's list of sources: pages it read, text,
// documents, and (synced automatically) the connected store's pages.

const PAGE_SIZE = 10;

interface AgentSource {
    id: number;
    type: "page" | "sitemap" | "crawl" | "product_feed" | "text" | "pdf";
    url: string | null;
    title: string | null;
    status: string;
    created_at: string;
    last_refresh_at: string | null;
    synced?: boolean;
    meta?: { format?: string };
}

const FORMAT_FOR: Record<AgentSource["type"], KnowledgeBase["format"]> = {
    page: "Link",
    sitemap: "Link",
    crawl: "Link",
    product_feed: "Csv",
    text: "Text",
    pdf: "Pdf",
};

function toKnowledgeBase(source: AgentSource): KnowledgeBase {
    const format = (source.meta?.format as KnowledgeBase["format"] | undefined) ?? FORMAT_FOR[source.type] ?? "Text";
    return {
        id: String(source.id),
        name: source.title || source.url || "Untitled",
        url: source.url ?? "",
        status: source.status === "ready" ? "active" : "inactive",
        createdAt: source.created_at,
        lastRefreshAt: source.last_refresh_at ?? source.created_at,
        format,
    };
}

async function listSources(search: string, page: number): Promise<KnowledgeBaseResponse> {
    const sources = await agentFetch<AgentSource[]>("/sources");
    const query = search.trim().toLowerCase();
    const matches = query
        ? sources.filter((s) => `${s.title ?? ""} ${s.url ?? ""}`.toLowerCase().includes(query))
        : sources;
    const start = (page - 1) * PAGE_SIZE;
    return {
        items: matches.slice(start, start + PAGE_SIZE).map(toKnowledgeBase),
        page,
        pageSize: PAGE_SIZE,
        total: matches.length,
    };
}

export async function getKnowledgeBase(page = 1) {
    return listSources("", page);
}

export async function searchKnowledge(search: string, page = 1) {
    return listSources(search, page);
}

function readFile(file: File, as: "base64" | "text"): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Couldn't read the file."));
        reader.onload = () => {
            const result = String(reader.result ?? "");
            resolve(as === "base64" ? result.slice(result.indexOf(",") + 1) : result);
        };
        if (as === "base64") reader.readAsDataURL(file);
        else reader.readAsText(file);
    });
}

export async function updateKnowledgeBase({ id, name, format, url, file, text }: KnowledgeBaseFormValues & { id?: string }) {
    if (id) {
        const body: Record<string, string> = { title: name };
        if (format === "Link") body.url = url;
        if (format === "Text") body.content = text;
        return agentFetch(`/sources/${encodeURIComponent(id)}`, { method: "PUT", body });
    }

    if (format === "Link") return agentFetch("/sources", { method: "POST", body: { type: "page", title: name, url } });
    if (format === "Text") return agentFetch("/sources", { method: "POST", body: { type: "text", title: name, content: text } });

    if (!(file instanceof File)) throw new Error(`${format} file is required`);
    if (format === "Pdf") {
        return agentFetch("/sources", { method: "POST", body: { type: "pdf", title: name, pdfBase64: await readFile(file, "base64") } });
    }
    if (format === "Csv") {
        // A CSV (FAQs, product notes...) is added as its text so the AI can search it.
        return agentFetch("/sources", { method: "POST", body: { type: "text", title: name, content: await readFile(file, "text") } });
    }
    throw new Error("Word documents can't be read yet. Please upload it as a PDF.");
}

export async function deleteKnowledgeBase(ids: string[]) {
    await Promise.all(ids.map((id) => agentFetch(`/sources/${encodeURIComponent(id)}`, { method: "DELETE" })));
    return listSources("", 1);
}
