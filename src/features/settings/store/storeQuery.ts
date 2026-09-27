import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getStores } from "./storeApi";

export const storeQueryKey = ["admin", "store"] as const;

export function useStoreQuery(search = "", cursor?: string) {
  return useQuery({
    queryKey: [...storeQueryKey, search, cursor],
    queryFn: () => getStores(search, cursor),
    placeholderData: keepPreviousData,
  });
}
