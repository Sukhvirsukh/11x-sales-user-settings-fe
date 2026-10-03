import { create } from "zustand";
import { ONBOARDING_STEPS, type OnboardingStep } from "./onBoardingType";

const COMPLETED_STEPS_KEY = "completedSteps";

function readCompletedSteps(): OnboardingStep[] {
    try {
        const saved: unknown = JSON.parse(localStorage.getItem(COMPLETED_STEPS_KEY) ?? "null");
        if (!Array.isArray(saved)) return [];
        return ONBOARDING_STEPS.filter((step) => saved.includes(step));
    } catch {
        return [];
    }
}

function firstIncompleteStep(completedSteps: OnboardingStep[]): OnboardingStep {
    return ONBOARDING_STEPS.find((step) => !completedSteps.includes(step)) ?? ONBOARDING_STEPS[0];
}

const initialCompletedSteps = readCompletedSteps();

/** Validation callbacks registered by each step's form (via react-hook-form's `trigger`). */
type StepValidator = () => Promise<boolean>;
const stepValidators = new Map<OnboardingStep, StepValidator>();

/** Returns an unregister function, so callers can use it directly as an effect cleanup. */
export function registerStepValidator(step: OnboardingStep, validate: StepValidator) {
    stepValidators.set(step, validate);
    return () => {
        stepValidators.delete(step);
    };
}

interface OnBoardingState {
    /** The step currently expanded. The user can move it freely, back and forth. */
    currentStep: OnboardingStep;
    completedSteps: OnboardingStep[];
    /** Navigate to a step, but only when the currently expanded step has no validation errors. */
    goToStep: (step: OnboardingStep) => Promise<void>;
    /** Force-navigate, bypassing validation (used after a successful save). */
    setCurrentStep: (step: OnboardingStep) => void;
    /** Mark a step as done after it is saved. Does not change the current step. */
    completeStep: (step: OnboardingStep) => void;
}

export const useOnBoardingStore = create<OnBoardingState>((set, get) => ({
    currentStep: firstIncompleteStep(initialCompletedSteps),
    completedSteps: initialCompletedSteps,
    goToStep: async (step) => {
        const { currentStep } = get();
        if (step === currentStep) return;

        const isValid = await (stepValidators.get(currentStep)?.() ?? true);
        if (!isValid) return;

        set({ currentStep: step });
    },
    setCurrentStep: (step) => set({ currentStep: step }),
    completeStep: (step) => set((state) => {
        if (state.completedSteps.includes(step)) return state;
        const completedSteps = [...state.completedSteps, step];
        localStorage.setItem(COMPLETED_STEPS_KEY, JSON.stringify(completedSteps));
        return { completedSteps };
    }),
}));
