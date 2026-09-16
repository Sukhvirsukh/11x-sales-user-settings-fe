import { useQuery } from "@tanstack/react-query";
import { getConfigurations, getIntegrations, getIntervals } from "./chatSettingsApi";


export const chatSettingsIntegrationsQueryKey = ["chatSettings", "integrations"];
export const chatSettingsConfigurationsQueryKey = ["chatSettings", "configurations"];
export const chatSettingsIntervalsQueryKey = ["chatSettings", "intervals"];

export const useIntegrationsQuery = () => {
    return useQuery({
        queryKey: chatSettingsIntegrationsQueryKey,
        queryFn: getIntegrations
    });
}


export const useConfigurationsQuery = () => {
    return useQuery({
        queryKey: chatSettingsConfigurationsQueryKey,
        queryFn: getConfigurations
    });
}

export const useIntervalsQuery = () => {
    return useQuery({
        queryKey: chatSettingsIntervalsQueryKey,
        queryFn: getIntervals
    });
}