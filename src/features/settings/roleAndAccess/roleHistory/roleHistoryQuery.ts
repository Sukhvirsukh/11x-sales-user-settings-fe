import { useQuery } from "@tanstack/react-query";
import { getRoles } from "./roleHistoryApi";

export const roleHistoryQueryKey = ["admin", "roles"] as const;

export function useRoleHistoryQuery() {
    return useQuery({
        queryKey: roleHistoryQueryKey,
        queryFn: getRoles,
    });
}
