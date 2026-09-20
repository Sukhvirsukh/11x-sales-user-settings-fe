import { useQuery } from "@tanstack/react-query";
import { getOverview } from "./overviewApi";

export const overviewQueryKey = ["admin", "overview"] as const;

export function useOverviewQuery() {
    return useQuery({
        queryKey: overviewQueryKey,
        queryFn: getOverview,
    });
}
