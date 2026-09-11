import { useQuery } from "@tanstack/react-query";
import { getPlans } from "./planApi";


export const planQueryKey = ["admin", "plan"] as const;

export function usePlanQuery() {
    return useQuery({
        queryKey: planQueryKey,
        queryFn: getPlans,
    });
}
