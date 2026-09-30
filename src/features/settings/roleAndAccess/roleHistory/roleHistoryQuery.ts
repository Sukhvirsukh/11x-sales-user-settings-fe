import { useInfiniteQuery } from "@tanstack/react-query";
import { getRoles } from "./roleHistoryApi";

export const roleHistoryQueryKey = ["admin", "roles"] as const;

export function useRoleHistoryQuery(search = "") {
    return useInfiniteQuery({
        queryKey: [...roleHistoryQueryKey, search],
        // Count the loaded pages as fresh for good, so coming back to this table (a tab switch,
        // navigating away and back, clearing the search box) renders the pages we already have
        // instead of revalidating — a stale infinite query refetches every cached page on mount.
        // Adding, editing or deleting a role still invalidates the key, which refetches the query.
        staleTime: Infinity,
        // The backend owns the page size; the cursor is all a request needs.
        queryFn: ({ pageParam }) => getRoles(search, pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            // `currentPage` catches up with `totalPages` once every page has been read, so an
            // exhausted table reports no next page and TanStack never fires another request.
            if (lastPage.currentPage >= lastPage.totalPages) return undefined;
            return lastPage.nextCursor ?? undefined;
        },
    });
}
