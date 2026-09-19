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

export function useSegmentsQuery(page: number, search = "") {
    return useQuery({
        queryKey: [...segmentsQueryKey, page, search],
        queryFn: () => getSegaments(page, search),
        placeholderData: keepPreviousData,
    });
}
