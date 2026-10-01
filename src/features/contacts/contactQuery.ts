import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getSegaments, getUserProfiles } from "./contactsApi";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { parseSegmentFilters } from "./segmentFilters";

export const userProfilesQueryKey = ["contacts", "userProfiles"];
export const segmentsQueryKey = ["contacts", "segments"];

export function useUserProfilesQuery() {
    return useQuery({
        queryKey: userProfilesQueryKey,
        queryFn: getUserProfiles,
    });
}

export function useSegmentsQuery() {
    const { filters } = useUrlFilters(parseSegmentFilters);
    const { search, status, createdAtFrom, createdAtTo } = filters;
    const query = useInfiniteQuery({
        queryKey: [...segmentsQueryKey, search.trim(), status, createdAtFrom, createdAtTo],
        // Keep the loaded pages fresh so coming back to this table renders what we already have
        // instead of revalidating (a stale infinite query refetches every cached page on mount).
        // Add/delete invalidate the key, which is what refreshes it.
        staleTime: Infinity,
        // The backend owns the page size; the cursor is all a request needs.
        queryFn: ({ pageParam }) => getSegaments({ ...filters, search: search.trim() }, pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) =>
            lastPage.currentPage >= lastPage.totalPages ? undefined : lastPage.nextCursor ?? undefined,
    });

    return { ...query, hasFilters: Boolean(search.trim() || status || createdAtFrom || createdAtTo) };
}
