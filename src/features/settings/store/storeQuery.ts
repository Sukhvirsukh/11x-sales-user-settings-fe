import { useInfiniteQuery } from "@tanstack/react-query";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { getStores } from "./storeApi";
import { parseStoreFilters } from "./storeFilters";

export const storeQueryKey = ["admin", "store"] as const;

export function useStoreQuery() {
  const { filters } = useUrlFilters(parseStoreFilters);
  const { search, status, createdAtFrom, createdAtTo } = filters;
  const query = useInfiniteQuery({
    queryKey: [...storeQueryKey, search.trim(), status, createdAtFrom, createdAtTo],
    // Keep the loaded pages fresh so coming back to this table renders what we already have instead
    // of revalidating (a stale infinite query refetches every cached page on mount). Add/edit/delete
    // invalidate the key, which is what refreshes it.
    staleTime: Infinity,
    // The backend owns the page size; the cursor is all a request needs.
    queryFn: ({ pageParam }) => getStores({ ...filters, search: search.trim() }, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage >= lastPage.totalPages ? undefined : lastPage.nextCursor ?? undefined,
  });

  const hasFilters = Boolean(search.trim() || status || createdAtFrom || createdAtTo);

  return { ...query, hasFilters };
}
