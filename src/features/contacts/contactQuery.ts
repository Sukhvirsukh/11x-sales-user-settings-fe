import { useQuery } from "@tanstack/react-query";
import { getSegaments, getUserProfiles } from "./contactsApi";

export const userProfilesQueryKey = ["contacts", "userProfiles"];
export const segamentsQueryKey = ["contacts", "segaments"];

export function useUserProfilesQuery() {
    return useQuery({
        queryKey: userProfilesQueryKey,
        queryFn: getUserProfiles,
    });
}

export function useSegamentsQuery() {
    return useQuery({
        queryKey: segamentsQueryKey,
        queryFn: getSegaments,
    });
}
