import { cn } from "@/lib/utils";
import { useOnBoardingStore } from "./onBoardingStore";
import { ONBOARDING_STEPS } from "./onBoardingType";

export default function OnBoardingProgress() {
    const completedSteps = useOnBoardingStore((state) => state.completedSteps);
    const stepNumber = completedSteps.length;

    return (
        <div
            role="progressbar"
            aria-label="Onboarding progress"
            aria-valuemin={0}
            aria-valuemax={ONBOARDING_STEPS.length}
            aria-valuenow={stepNumber}
            aria-valuetext={`Step ${stepNumber} of ${ONBOARDING_STEPS.length}`}
            className={cn("absolute -top-2 z-[-1] left-0 right-0 h-12 overflow-hidden rounded-full bg-primary/15")}
        >
            <div
                className={cn(
                    "h-full rounded-l-full bg-primary transition-[width] duration-300",
                    stepNumber === ONBOARDING_STEPS.length && "rounded-r-full",
                )}
                style={{ width: `${(stepNumber / ONBOARDING_STEPS.length) * 100}%` }}
            />
        </div>
    )
}
