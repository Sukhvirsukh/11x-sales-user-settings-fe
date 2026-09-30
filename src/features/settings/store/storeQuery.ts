import { useInfiniteQuery } from "@tanstack/react-query";
import { getStores } from "./storeApi";

export const storeQueryKey = ["admin", "store"] as const;

export function useStoreQuery(search = "") {
  return useInfiniteQuery({
    queryKey: [...storeQueryKey, search],
    // Keep the loaded pages fresh so coming back to this table renders what we already have instead
    // of revalidating (a stale infinite query refetches every cached page on mount). Add/edit/delete
    // invalidate the key, which is what refreshes it.
    staleTime: Infinity,
    // The backend owns the page size; the cursor is all a request needs.
    queryFn: ({ pageParam }) => getStores(search, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage >= lastPage.totalPages ? undefined : lastPage.nextCursor ?? undefined,
  });
}
