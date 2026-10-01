export const ONBOARDING_STEPS = [
    "add-agent",
    "train-agent",
    "test-agent",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];


export type AddAgentType = {
    agentUrl: string;
    gitUrl: string;
    accessToken: string;
}

export type TrainAgentFormData = {
    agentName: string;
    language: "english" | "french" | "spanish";
    tone: string;
    unexpectedMoment: string;
    additionalInfo: string;
}