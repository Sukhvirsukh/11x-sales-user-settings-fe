import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSegaments, getUserProfiles } from "./contactsApi";

export const userProfilesQueryKey = ["contacts", "userProfiles"];
export const segmentsQueryKey = ["contacts", "segments"];

export function useUserProfilesQuery() {
    return useQuery({
        queryKey: userProfilesQueryKey,
        queryFn: getUserProfiles,
    });
}

export function useSegmentsQuery(page: number, search = "", cursor?: string) {
    return useQuery({
        queryKey: [...segmentsQueryKey, page, search, cursor],
        queryFn: () => getSegaments(page, search, cursor),
        placeholderData: keepPreviousData,
    });
}
