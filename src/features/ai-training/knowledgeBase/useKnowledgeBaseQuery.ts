import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getKnowledgeBase } from "./knowledgeBaseApi";


export const knowledgeBaseQueryKey = ["admin", "knowledgeBase"] as const;

export function useKnowledgeBaseQuery(search = "", cursor?: string) {
    return useQuery({
        queryKey: [...knowledgeBaseQueryKey, search, cursor],
        queryFn: () => getKnowledgeBase(search, cursor),
        placeholderData: keepPreviousData,
    });
}
