import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRoles } from "./roleHistoryApi";

export const roleHistoryQueryKey = ["admin", "roles"] as const;

export function useRoleHistoryQuery(search = "", cursor?: string) {
    return useQuery({
        queryKey: [...roleHistoryQueryKey, search, cursor],
        queryFn: () => getRoles(search, cursor),
        placeholderData: keepPreviousData,
    });
}
