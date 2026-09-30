import AppSection from "@/components/design/AppSectoin"
import Heading from "@/components/design/Heading"
import { Skeleton } from "@/components/ui/skeleton"

const CARDS = 3
const FEATURE_ROWS = 4

/** Mirrors `PlanCard`'s box so the real cards land in the same place once the query resolves. */
function PlanCardSkeleton() {
    return (
        <div className="flex min-w-62.5 shrink-0 basis-[85%] snap-center flex-col rounded-[10px] border border-primary/20 pt-2.5 sm:basis-62.5 sm:grow lg:min-w-0 lg:flex-1">
            <div className="border-b border-primary/20 p-2.5 pt-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-1.5 h-3.5 w-28" />
            </div>
            <div className="flex flex-1 flex-col pb-2.5">
                <ul className="p-2.5">
                    {Array.from({ length: FEATURE_ROWS }, (_, index) => (
                        <li key={index} className="flex gap-2 py-1.25">
                            <Skeleton className="size-4 shrink-0 rounded-full" />
                            <Skeleton className="h-4 flex-1" />
                        </li>
                    ))}
                </ul>
                <div className="mt-auto p-2.5">
                    <Skeleton className="h-8 w-full rounded-[10px]" />
                </div>
            </div>
        </div>
    )
}

/**
 * Loading placeholder for the plan section. The row is not scrollable, so the queued
 * cards beyond the first stay clipped exactly as they are below `sm`.
 */
export default function PlanSkeleton() {
    return (
        <AppSection className="overflow-hidden">
            <Heading size="lg">Plans</Heading>
            <div className="flex w-full min-w-0 gap-1 overflow-hidden" aria-hidden="true">
                {Array.from({ length: CARDS }, (_, index) => (
                    <PlanCardSkeleton key={index} />
                ))}
            </div>
        </AppSection>
    )
}
