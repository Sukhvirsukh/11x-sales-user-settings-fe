import { useSearchParams } from "react-router"

/** A filter value as stored in the URL; arrays become one comma-separated parameter. */
type UrlFilterValue = string | string[] | null

/** Share URL state while each feature defines its validated filter values. */
export function useUrlFilters<T extends Record<string, UrlFilterValue>>(
    parse: (params: URLSearchParams) => T,
) {
    const [searchParams, setSearchParams] = useSearchParams()
    const filters = parse(searchParams)

    /** Apply related changes together; null, an empty string, or an empty array removes a filter.
        Array values are joined with commas, so parsers split them back apart. */
    function setFilters(updates: Partial<T>) {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)
            for (const [key, value] of Object.entries(updates)) {
                if (value === undefined) continue
                const serialized = Array.isArray(value) ? value.join(",") : value
                if (serialized === null || serialized === "") nextParams.delete(key)
                else nextParams.set(key, serialized)
            }
            return nextParams
        }, { replace: true })
    }

    return { filters, setFilters }
}
