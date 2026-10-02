import { parseDateRangeParams } from "@/lib/filterParams"
import type { SegmentStatusFilter } from "./contactType"

/** Reads a single `status=active` / `status=inactive`; anything else means no filter. */
function parseStatus(value: string | null): SegmentStatusFilter | null {
    const normalized = value?.toLowerCase()

    return normalized === "active" || normalized === "inactive" ? normalized : null
}

export function parseSegmentFilters(params: URLSearchParams) {
    const status = parseStatus(params.get("status"))

    const [createdAtFrom, createdAtTo] = parseDateRangeParams(params, "createdAt")

    return {
        search: params.get("search") ?? "",
        status,
        createdAtFrom,
        createdAtTo,
    }
}

export type SegmentFilters = ReturnType<typeof parseSegmentFilters>
