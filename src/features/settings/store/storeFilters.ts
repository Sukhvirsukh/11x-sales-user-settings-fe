import { parseDateRangeParams } from "@/lib/filterParams"

export type StoreStatusFilter = "active" | "inactive"

/** Reads a single `status=active` / `status=inactive`; anything else means no filter. */
function parseStatus(value: string | null): StoreStatusFilter | null {
    const normalized = value?.toLowerCase()

    return normalized === "active" || normalized === "inactive" ? normalized : null
}

export function parseStoreFilters(params: URLSearchParams) {
    const [createdAtFrom, createdAtTo] = parseDateRangeParams(params, "createdAt")

    return {
        search: params.get("search") ?? "",
        status: parseStatus(params.get("status")),
        createdAtFrom,
        createdAtTo,
    }
}

export type StoreFilters = ReturnType<typeof parseStoreFilters>
