import { skipToken, useQuery } from "@tanstack/react-query";
import { useAgentStore } from "@/stores/agentStore";
import { getOverview } from "./overviewApi";

export const overviewQueryKey = ["admin", "overview"] as const;

export function useOverviewQuery() {
    const agentId = useAgentStore((state) => state.selectedAgentId);

    return useQuery({
        queryKey: [...overviewQueryKey, agentId],
        queryFn: agentId ? ({ signal }) => getOverview(agentId, signal) : skipToken,
    });
}
