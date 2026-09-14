import { useQuery } from "@tanstack/react-query";
import { getIntegrations } from "./chatSettingsApi";


export const chatSettingsIntegrationsQueryKey = ["chatSettings", "integrations"];

export const useIntegrationsQuery = () => {
    return useQuery({
        queryKey: chatSettingsIntegrationsQueryKey,
        queryFn: getIntegrations
    });
}