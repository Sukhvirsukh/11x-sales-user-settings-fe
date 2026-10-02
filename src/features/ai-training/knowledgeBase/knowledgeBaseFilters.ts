import { parseDateRangeParams, parseListParam } from "@/lib/filterParams"
import type { KnowledgeBaseFormat, KnowledgeBaseStatus } from "./knowledgeBaseTypes"

/** Formats the filter offers; `Csv` and `Text` entries are not filterable yet. */
export const knowledgeBaseFormatFilters = ["Doc", "Pdf", "Link"] as const satisfies readonly KnowledgeBaseFormat[]
export type KnowledgeBaseFormatFilter = (typeof knowledgeBaseFormatFilters)[number]

/** Reads a single `status=active` / `status=inactive`; anything else means no filter. */
function parseStatus(value: string | null): KnowledgeBaseStatus | null {
    const normalized = value?.toLowerCase()

    return normalized === "active" || normalized === "inactive" ? normalized : null
}

export function parseKnowledgeBaseFilters(params: URLSearchParams) {
    const [createdAtFrom, createdAtTo] = parseDateRangeParams(params, "createdAt")
    const [lastUpdatedFrom, lastUpdatedTo] = parseDateRangeParams(params, "lastUpdated")

    return {
        search: params.get("search") ?? "",
        status: parseStatus(params.get("status")),
        format: parseListParam(params.get("format"), knowledgeBaseFormatFilters),
        createdAtFrom,
        createdAtTo,
        lastUpdatedFrom,
        lastUpdatedTo,
    }
}

export type KnowledgeBaseFilters = ReturnType<typeof parseKnowledgeBaseFilters>
