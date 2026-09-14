import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getKnowledgeBase, searchKnowledge } from "./knowledgeBaseApi";


export const knowledgeBaseQueryKey = ["admin", "knowledgeBase"] as const;

export function useKnowledgeBaseQuery(page: number, search = "") {
    return useQuery({
        queryKey: [...knowledgeBaseQueryKey, page, search],
        queryFn: () => search ? searchKnowledge(search, page) : getKnowledgeBase(page),
        placeholderData: keepPreviousData,
    });
}
