import { parseDateRangeParams } from "@/lib/filterParams"

export type AgentStatusFilter = "active" | "inactive"

/** Reads a single `status=active` / `status=inactive`; anything else means no filter. */
function parseStatus(value: string | null): AgentStatusFilter | null {
    const normalized = value?.toLowerCase()

    return normalized === "active" || normalized === "inactive" ? normalized : null
}

export function parseAgentFilters(params: URLSearchParams) {
    const [createdAtFrom, createdAtTo] = parseDateRangeParams(params, "createdAt")

    return {
        search: params.get("search") ?? "",
        status: parseStatus(params.get("status")),
        createdAtFrom,
        createdAtTo,
    }
}

export type AgentFilters = ReturnType<typeof parseAgentFilters>