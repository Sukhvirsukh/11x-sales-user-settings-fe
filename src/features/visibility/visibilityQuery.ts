import { useQuery } from "@tanstack/react-query";
import { getVisibility } from "./visibilityApi";

export const visibilityQueryKey = ["chatbox", "visibility"] as const;

export function useChatVisibilityQuery() {
  return useQuery({ queryKey: visibilityQueryKey, queryFn: getVisibility, staleTime: Infinity });
}

export function useVisibilityQuery() {
  return useQuery({ queryKey: visibilityQueryKey, queryFn: getVisibility, staleTime: Infinity, refetchOnMount: "always" });
}
