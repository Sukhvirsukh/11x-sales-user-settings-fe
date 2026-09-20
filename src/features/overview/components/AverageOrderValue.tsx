import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { cn, formatNumber } from "@/lib/utils";
import type { AverageOrderValueSummary } from "../overviewType";

/** Swatch colors for the breakdown rows, in the order the API sends them. */
const SWATCHES = ["bg-primary", "bg-slider-track"];

function OrderValueSummary({ value, changePercent, period, progressPercent, breakdown }: AverageOrderValueSummary) {
    const isUp = changePercent >= 0;

    return (
        <>
            <Heading >Average order value</Heading>
            <div className="w-[185px]">
                <Slider
                    aria-label="Average order value progress"
                    // Read-only progress bar, so the value is controlled and never dragged.
                    value={[progressPercent]}
                    className="pointer-events-none w-full [&_[data-slot=slider-track]]:h-1.5 [&_[data-slot=slider-track]]:bg-slider-track [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:hidden"
                />
                <div className="flex mt-2 flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-3xl font-semibold leading-none text-foreground">{formatNumber(value)}</span>
                    <span className={cn("rounded-sm px-1.5 py-1 text-xs font-medium", isUp ? "bg-success-surface text-success" : "bg-danger-surface text-danger")}>
                        {isUp ? "+" : ""}{formatNumber(changePercent, "percent")}
                    </span>
                    <span className="text-sm text-content-muted">{period}</span>
                </div>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-content-muted">
                {breakdown.map(({ label, value: count }, index) => (
                    <div key={label} className="flex items-center gap-2">
                        <span className={cn("h-4 w-2", SWATCHES[index] ?? SWATCHES[1])} aria-hidden />
                        <span><strong className="font-medium text-foreground">{formatNumber(count)}</strong> {label}</span>
                    </div>
                ))}
            </div>
        </>
    );
}

interface AverageOrderValueProps {
    /** `averageOrderValue` section of the Overview response. */
    panel?: AverageOrderValueSummary;
    /** True while the Overview request is in flight. */
    isLoading?: boolean;
}

export default function AverageOrderValue({ panel, isLoading = false }: AverageOrderValueProps) {
    if (isLoading) {
        return (
            <AppSection>
                <Skeleton className="h-32 w-full" />
            </AppSection>
        );
    }

    if (!panel) {
        return (
            <AppSection>
                <p className="flex h-32 w-full items-center justify-center text-sm text-content-muted">
                    No average order value data.
                </p>
            </AppSection>
        );
    }

    return (
        <AppSection>
            <OrderValueSummary {...panel} />
        </AppSection>
    );
}
