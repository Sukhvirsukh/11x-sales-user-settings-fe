import { useInfiniteQuery } from "@tanstack/react-query";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { getKnowledgeBase } from "./knowledgeBaseApi";
import { parseKnowledgeBaseFilters } from "./knowledgeBaseFilters";


export const knowledgeBaseQueryKey = ["admin", "knowledgeBase"] as const;

export function useKnowledgeBaseQuery() {
    const { filters } = useUrlFilters(parseKnowledgeBaseFilters);
    const { search, status, format, createdAtFrom, createdAtTo, lastUpdatedFrom, lastUpdatedTo } = filters;
    const query = useInfiniteQuery({
        queryKey: [
            ...knowledgeBaseQueryKey,
            search.trim(),
            status,
            format.join(","),
            createdAtFrom,
            createdAtTo,
            lastUpdatedFrom,
            lastUpdatedTo,
        ],
        // Count the loaded pages as fresh for good, so coming back to this table (a tab switch,
        // navigating away and back) renders the pages we already have instead of revalidating —
        // a stale infinite query refetches every cached page on mount. Adding or deleting an
        // entry still invalidates the key, which refetches the mounted query.
        staleTime: Infinity,
        // The backend owns the page size; the cursor is all a request needs.
        queryFn: ({ pageParam }) => getKnowledgeBase({ ...filters, search: search.trim() }, pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            // `currentPage` catching up with `totalPages` means every page has been read.
            if (lastPage.currentPage >= lastPage.totalPages) return undefined;
            return lastPage.nextCursor ?? undefined;
        },
    });

    const hasFilters = Boolean(search.trim() || status || format.length || createdAtFrom || createdAtTo || lastUpdatedFrom || lastUpdatedTo);

    return { ...query, hasFilters };
}
