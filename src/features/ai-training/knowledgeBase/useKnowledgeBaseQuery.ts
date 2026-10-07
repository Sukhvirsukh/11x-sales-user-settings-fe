import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getKnowledgeBase, searchKnowledge } from "./knowledgeBaseApi";


export const knowledgeBaseQueryKey = ["admin", "knowledgeBase"] as const;

export function useKnowledgeBaseQuery(page: number, search = "") {
    return useQuery({
        queryKey: [...knowledgeBaseQueryKey, page, search],
        queryFn: () => search ? searchKnowledge(search, page) : getKnowledgeBase(page),
        placeholderData: keepPreviousData,
        // Websites and new sources finish in the background; keep the list current until they do.
        refetchInterval: (query) => (query.state.data?.items.some((item) => item.status === "processing") ? 4000 : false),
    });
}
