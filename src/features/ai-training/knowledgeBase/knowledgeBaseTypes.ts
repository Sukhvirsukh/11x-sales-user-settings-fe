

export interface KnowledgeBase extends Record<string, unknown> {
    id: string
    name: string,
    url: string,
    status: "active" | "inactive",
    file?: Blob | string | null,
    text?: string,
    createdAt: string,
    lastRefreshAt: string,
    format: "Link" | "Pdf" | "Doc" | "Csv" | "Text",
}

export interface KnowledgeBaseResponse {
    items: KnowledgeBase[],
    nextCursor: string | null
    hasMore: boolean
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
}
