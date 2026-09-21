import { useQuery } from "@tanstack/react-query";
import { getPromptTools } from "./promptToolsApi";

export const promptToolsQueryKey = ["aiTraining", "promptTools"];

export const usePromptToolsQuery = () => {
    return useQuery({
        queryKey: promptToolsQueryKey,
        queryFn: getPromptTools,
    });
};
