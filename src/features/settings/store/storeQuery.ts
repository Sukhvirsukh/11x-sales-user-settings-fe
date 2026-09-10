import { useQuery } from "@tanstack/react-query";
import { getStores } from "./storeApi";

export const storeQueryKey = ["admin", "store"] as const;

export function useStoreQuery() {
  return useQuery({
    queryKey: storeQueryKey,
    queryFn: getStores,
  });
}
