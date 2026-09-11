import { useQuery } from "@tanstack/react-query";
import { getReports } from "./reportApi";


export const reportQueryKey = ["admin", "reports"] as const;

export function useReportQuery() {
    return useQuery({
        queryKey: reportQueryKey,
        queryFn: getReports,
        retryOnMount: true
    });
}

