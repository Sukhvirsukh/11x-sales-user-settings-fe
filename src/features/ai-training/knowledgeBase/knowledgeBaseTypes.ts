

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
    prevCursor: string | null
    hasMore: boolean
    hasNext: boolean
    hasPrev: boolean
    nextPage: number
    prevPage: number
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
}
