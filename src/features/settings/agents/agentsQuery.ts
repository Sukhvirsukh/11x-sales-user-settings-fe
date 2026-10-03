import { useInfiniteQuery } from "@tanstack/react-query";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { getAgents } from "./agentsApi";
import { parseAgentFilters, type AgentFilters } from "./agentsFilters";

export const agentsQueryKey = ["admin", "agent"] as const;

export function useAgentsQuery(filterOverrides?: AgentFilters) {
  const { filters: urlFilters } = useUrlFilters(parseAgentFilters);
  const filters = filterOverrides ?? urlFilters;
  const { search, status, createdAtFrom, createdAtTo } = filters;
  const query = useInfiniteQuery({
    queryKey: [...agentsQueryKey, search.trim(), status, createdAtFrom, createdAtTo],
    // Keep the loaded pages fresh so coming back to this table renders what we already have instead
    // of revalidating (a stale infinite query refetches every cached page on mount). Add/edit/delete
    // invalidate the key, which is what refreshes it.
    staleTime: Infinity,
    // The backend owns the page size; the cursor is all a request needs.
    queryFn: ({ pageParam }) => getAgents({ ...filters, search: search.trim() }, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage >= lastPage.totalPages ? undefined : lastPage.nextCursor ?? undefined,
  });

  const hasFilters = Boolean(search.trim() || status || createdAtFrom || createdAtTo);

  return { ...query, hasFilters };
}
