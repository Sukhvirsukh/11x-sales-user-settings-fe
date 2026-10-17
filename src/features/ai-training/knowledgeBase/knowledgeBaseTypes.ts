/** How a knowledge source was added; Website and Sitemap read many pages, Store is synced from Shopify. */
export type KnowledgeFormat = "Link" | "Website" | "Sitemap" | "Pdf" | "Doc" | "Csv" | "Text" | "Store"

export type KnowledgeStatus = "ready" | "processing" | "failed"

export interface KnowledgeBase extends Record<string, unknown> {
    id: string
    name: string,
    url: string,
    status: KnowledgeStatus,
    /** Why it failed, in the agent's words. */
    error?: string | null,
    /** Pages read, for Website and Sitemap sources. */
    pages?: number,
    /** Kept up to date from the connected store; not edited by hand. */
    synced?: boolean,
    file?: Blob | string | null,
    text?: string,
    createdAt: string,
    lastRefreshAt: string,
    format: KnowledgeFormat,
}

export interface KnowledgeBaseResponse {
    items: KnowledgeBase[],
    page: number,
    pageSize: number
    total: number
}
