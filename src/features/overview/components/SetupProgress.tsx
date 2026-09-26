import { CheckCircle2, Circle } from "lucide-react";

import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import type { SetupProgressSummary } from "../overviewType";

function SetupChecklist({ completedSteps, totalSteps, percent, steps }: SetupProgressSummary) {
    return (
        <>
            <Heading>Setup progress</Heading>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3 rounded-[10px] bg-surface-raised p-2.5">
                    <span className="text-base text-foreground">{completedSteps} of {totalSteps} steps completed</span>
                    <Slider
                        aria-label="Setup progress"
                        // Read-only progress bar, so the value is controlled and never dragged.
                        value={[percent]}
                        className="pointer-events-none max-w-16 w-20 shrink-0 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-border [&_[data-slot=slider-range]]:bg-success [&_[data-slot=slider-thumb]]:hidden"
                    />
                </div>

                <div className="space-y-4">
                    {steps.map(({ title, completed }) => (
                        <div key={title} className="flex items-start gap-3">
                            {completed ? (
                                <CheckCircle2 className="mt-0.5 size-6 shrink-0 fill-primary text-background [&_circle]:stroke-none" aria-hidden />
                            ) : (
                                <Circle className="mt-0.5 size-5 shrink-0 text-content-muted" aria-hidden />
                            )}
                            <p className="text-base font-medium text-foreground">{title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

interface SetupProgressProps {
    /** `setupProgress` section of the Overview response. */
    panel?: SetupProgressSummary;
    /** True while the Overview request is in flight. */
    isLoading?: boolean;
}

export default function SetupProgress({ panel, isLoading = false }: SetupProgressProps) {
    if (isLoading) {
        return (
            <AppSection>
                <Skeleton className="h-56 w-full" />
            </AppSection>
        );
    }

    if (!panel || panel.steps.length === 0) {
        return (
            <AppSection>
                <p className="flex h-56 w-full items-center justify-center text-sm text-content-muted">
                    No setup steps yet.
                </p>
            </AppSection>
        );
    }

    return (
        <AppSection>
            <SetupChecklist {...panel} />
        </AppSection>
    );
}
