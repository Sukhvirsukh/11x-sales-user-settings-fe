import { useInfiniteQuery } from "@tanstack/react-query";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { getRoles } from "./roleHistoryApi";
import { parseRoleHistoryFilters } from "./roleHistoryFilters";

export const roleHistoryQueryKey = ["admin", "roles"] as const;

export function useRoleHistoryQuery() {
    const { filters } = useUrlFilters(parseRoleHistoryFilters);
    const { search, role, status, createdAtFrom, createdAtTo } = filters;
    const query = useInfiniteQuery({
        queryKey: [
            ...roleHistoryQueryKey,
            search.trim(),
            role.join(","),
            status,
            createdAtFrom,
            createdAtTo,
        ],
        // Count the loaded pages as fresh for good, so coming back to this table (a tab switch,
        // navigating away and back, clearing the search box) renders the pages we already have
        // instead of revalidating — a stale infinite query refetches every cached page on mount.
        // Adding, editing or deleting a role still invalidates the key, which refetches the query.
        staleTime: Infinity,
        // The backend owns the page size; the cursor is all a request needs.
        queryFn: ({ pageParam }) => getRoles({ ...filters, search: search.trim() }, pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            // `currentPage` catches up with `totalPages` once every page has been read, so an
            // exhausted table reports no next page and TanStack never fires another request.
            if (lastPage.currentPage >= lastPage.totalPages) return undefined;
            return lastPage.nextCursor ?? undefined;
        },
    });

    const hasFilters = Boolean(search.trim() || role.length || status || createdAtFrom || createdAtTo);

    return { ...query, hasFilters };
}
