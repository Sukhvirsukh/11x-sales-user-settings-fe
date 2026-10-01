// import { apiFetch } from "@/lib/api";
import type { AddAgentType, TrainAgentFormData } from "./onBoardingType";
import { delay } from "@/lib/utils";


export async function addAgent(agentDetails: AddAgentType) {
    await delay(1000)
    // const response = await apiFetch<AddAgentType>("/admin/agents", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(agentDetails),
    // });
    return agentDetails

}


export async function trainAgent(trainData: TrainAgentFormData) {
    await delay(1000)
    // const response = await apiFetch<TrainAgentFormData>("/admin/agents", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(trainData),
    // });
    return trainData

}

export async function completeBoarding() {
    await delay(1000)
    // const response = await apiFetch("/admin/boarding", {
    //     method: "POST",
    // });
    return true
}