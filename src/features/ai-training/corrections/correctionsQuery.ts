import { useQuery } from "@tanstack/react-query";

import { getCorrections } from "./correctionsApi";

export const correctionsQueryKey = ["aiTraining", "corrections"] as const;

export function useCorrectionsQuery() {
    return useQuery({
        queryKey: correctionsQueryKey,
        queryFn: getCorrections,
    });
}
