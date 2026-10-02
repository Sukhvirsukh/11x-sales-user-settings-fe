import { parseDateRangeParams, parseListParam } from "@/lib/filterParams"

/** Roles the filter offers; values match the uppercase role the API expects. */
export const roleFilters = ["EDITOR", "MEMBER"] as const
export type RoleFilter = (typeof roleFilters)[number]

export type RoleStatusFilter = "active" | "inactive"

/** Reads a single `status=active` / `status=inactive`; anything else means no filter. */
function parseStatus(value: string | null): RoleStatusFilter | null {
    const normalized = value?.toLowerCase()

    return normalized === "active" || normalized === "inactive" ? normalized : null
}

export function parseRoleHistoryFilters(params: URLSearchParams) {
    const [createdAtFrom, createdAtTo] = parseDateRangeParams(params, "createdAt")

    return {
        search: params.get("search") ?? "",
        role: parseListParam(params.get("role"), roleFilters),
        status: parseStatus(params.get("status")),
        createdAtFrom,
        createdAtTo,
    }
}

export type RoleHistoryFilters = ReturnType<typeof parseRoleHistoryFilters>
