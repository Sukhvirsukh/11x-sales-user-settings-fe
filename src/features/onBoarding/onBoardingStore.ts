import { create } from "zustand";
import { ONBOARDING_STEPS, type OnboardingStep } from "./onBoardingType";

const COMPLETED_STEPS_KEY = "completedSteps";

function readCompletedSteps(): OnboardingStep[] {
    try {
        const saved: unknown = JSON.parse(localStorage.getItem(COMPLETED_STEPS_KEY) ?? "null");
        if (!Array.isArray(saved)) return ["add-agent"];

        const lastStepIndex = ONBOARDING_STEPS.reduce(
            (index, step, stepIndex) => saved.includes(step) ? stepIndex : index,
            0,
        );
        return ONBOARDING_STEPS.slice(0, lastStepIndex + 1);
    } catch {
        return ["add-agent"];
    }
}

interface OnBoardingState {
    completedSteps: OnboardingStep[];
    changeStep: (step: OnboardingStep) => void;
}

export const useOnBoardingStore = create<OnBoardingState>((set) => ({
    completedSteps: readCompletedSteps(),
    changeStep: (step) => set((state) => {
        const completedSteps = state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step];
        localStorage.setItem(COMPLETED_STEPS_KEY, JSON.stringify(completedSteps));
        return { completedSteps };
    })
}));
