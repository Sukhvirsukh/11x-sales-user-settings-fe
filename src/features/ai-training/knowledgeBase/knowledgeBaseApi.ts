import { agentFetch } from "@/lib/agentApi";
import type { KnowledgeBase, KnowledgeBaseResponse } from "./knowledgeBaseTypes";
import type { KnowledgeBaseFormValues } from "./knowledgeBaseSchema";

// The knowledge base is the AI agent's list of sources: pages it read, text,
// documents, and (synced automatically) the connected store's pages.

const PAGE_SIZE = 10;

interface AgentSource {
    id: number;
    type: "page" | "sitemap" | "crawl" | "product_feed" | "text" | "pdf" | "shopify_catalog";
    url: string | null;
    title: string | null;
    status: string;
    error: string | null;
    children: number;
    created_at: string;
    last_refresh_at: string | null;
    synced?: boolean;
    meta?: { format?: string };
}

const FORMAT_FOR: Record<AgentSource["type"], KnowledgeBase["format"]> = {
    page: "Link",
    sitemap: "Sitemap",
    crawl: "Website",
    product_feed: "Csv",
    text: "Text",
    pdf: "Pdf",
    shopify_catalog: "Store",
};

/** Why a source failed, in plain words; anything unrecognised is shown as the agent wrote it. */
function friendlyError(error: string | null): string | null {
    if (!error) return null;
    if (/fetch failed|ENOTFOUND|EAI_AGAIN|getaddrinfo|ECONNREFUSED/i.test(error)) return "Couldn't reach this address. Check it's correct and public.";
    if (/\b404\b|not found/i.test(error)) return "Page not found (404). Check the address.";
    if (/\b(401|403)\b|forbidden/i.test(error)) return "The site blocked access to this page.";
    if (/429|resource exhausted|quota|rate limit/i.test(error)) return "Busy right now. It will retry automatically in a few minutes.";
    if (/timed? ?out|timeout|aborted/i.test(error)) return "The site took too long to respond. It will retry automatically.";
    if (/\b5\d\d\b|unavailable|overloaded/i.test(error)) return "The site had an error. It will retry automatically.";
    return error;
}

/** The agent's statuses (ready, failed, refreshing, pending…) as the three the screen shows. */
function toStatus(status: string): KnowledgeBase["status"] {
    if (status === "ready") return "ready";
    if (status === "failed") return "failed";
    return "processing";
}

function toKnowledgeBase(source: AgentSource): KnowledgeBase {
    const format = (source.meta?.format as KnowledgeBase["format"] | undefined) ?? FORMAT_FOR[source.type] ?? "Text";
    return {
        id: String(source.id),
        name: source.title || source.url || "Untitled",
        url: source.url ?? "",
        status: toStatus(source.status),
        error: friendlyError(source.error),
        pages: Number(source.children) || 0,
        synced: Boolean(source.synced) || source.type === "shopify_catalog",
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

/** Text of a Word (.docx) file, read in the browser; the reader loads only when needed. */
async function wordToText(file: File): Promise<string> {
    if (!/\.docx$/i.test(file.name)) throw new Error("Only .docx Word files can be read. Save older .doc files as .docx or PDF.");
    const mammoth = await import("mammoth");
    const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    if (!value.trim()) throw new Error("That document has no text to learn from.");
    return value;
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
    const isAddress = format === "Link" || format === "Website" || format === "Sitemap";
    if (id) {
        const body: Record<string, string> = { title: name };
        if (isAddress) body.url = url.trim();
        if (format === "Text") body.content = text;
        return agentFetch(`/sources/${encodeURIComponent(id)}`, { method: "PUT", body });
    }

    if (format === "Link") return agentFetch("/sources", { method: "POST", body: { type: "page", title: name, url: url.trim() } });
    // A whole site or sitemap reads many pages in the background; the list shows it as processing.
    if (format === "Website") return agentFetch("/sources", { method: "POST", body: { type: "crawl", title: name, url: url.trim() } });
    if (format === "Sitemap") return agentFetch("/sources", { method: "POST", body: { type: "sitemap", title: name, url: url.trim() } });
    if (format === "Text") return agentFetch("/sources", { method: "POST", body: { type: "text", title: name, content: text } });

    if (!(file instanceof File)) throw new Error(`${format} file is required`);
    if (format === "Pdf") {
        return agentFetch("/sources", { method: "POST", body: { type: "pdf", title: name, pdfBase64: await readFile(file, "base64") } });
    }
    if (format === "Csv") {
        // A CSV (FAQs, product notes...) is added as its text so the AI can search it.
        return agentFetch("/sources", { method: "POST", body: { type: "text", format: "Csv", title: name, content: await readFile(file, "text") } });
    }
    if (format === "Doc") {
        return agentFetch("/sources", { method: "POST", body: { type: "text", format: "Doc", title: name, content: await wordToText(file) } });
    }
    throw new Error("Choose what kind of knowledge this is.");
}

/** Reads the source again now: the page or site is fetched again, text and files re-indexed. */
export function refreshKnowledge(id: string) {
    return agentFetch(`/sources/${encodeURIComponent(id)}/refresh`, { method: "POST" });
}

export async function deleteKnowledgeBase(ids: string[]) {
    await Promise.all(ids.map((id) => agentFetch(`/sources/${encodeURIComponent(id)}`, { method: "DELETE" })));
    return listSources("", 1);
}
