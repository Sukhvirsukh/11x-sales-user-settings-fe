import { isValid, parseISO } from "date-fns"

/** Reads a `yyyy-MM-dd` filter date, ignoring anything malformed such as `2026-13-40`. */
export function parseDateParam(value: string | null) {
    return value && /^\d{4}-\d{2}-\d{2}$/.test(value) && isValid(parseISO(value)) ? value : null
}

/** Reads a comma-separated filter list, keeping only known values in their canonical order. */
export function parseListParam<T extends string>(value: string | null, allowed: readonly T[]): T[] {
    if (!value) return []
    const requested = value.split(",").map((part) => part.trim().toLowerCase())

    return allowed.filter((item) => requested.includes(item.toLowerCase()))
}

/** Reads the `<base>From`/`<base>To` pair; a reversed range is ignored as a whole. */
export function parseDateRangeParams(params: URLSearchParams, base: string): [string | null, string | null] {
    const from = parseDateParam(params.get(`${base}From`))
    const to = parseDateParam(params.get(`${base}To`))
    const reversed = Boolean(from && to && from > to)

    return reversed ? [null, null] : [from, to]
}
