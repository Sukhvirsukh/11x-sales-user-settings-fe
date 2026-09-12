import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getKnowledgeBase } from "./knowledgeBaseApi";


export const knowledgeBaseQueryKey = ["admin", "knowledgeBase"] as const;

export function useKnowledgeBaseQuery(page: number) {
    return useQuery({
        queryKey: [...knowledgeBaseQueryKey, page],
        queryFn: () => getKnowledgeBase(page),
        placeholderData: keepPreviousData,
    });
}
