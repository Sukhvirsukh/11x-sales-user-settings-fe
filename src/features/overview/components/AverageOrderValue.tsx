import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { Slider } from "@/components/ui/slider";

export default function AverageOrderValue() {
    return (
        <AppSection>
            <Heading >Average order value</Heading>
            <div className="w-[185px]">
                <Slider
                    aria-label="Average order value progress"
                    defaultValue={[68]}
                    className="pointer-events-none w-full [&_[data-slot=slider-track]]:h-1.5 [&_[data-slot=slider-track]]:bg-slider-track [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:hidden"
                />
                <div className="flex mt-2 flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-3xl font-semibold leading-none text-foreground">117</span>
                    <span className="rounded-sm bg-success-light px-1.5 py-1 text-xs font-medium text-success">+12%</span>
                    <span className="text-sm text-ghost">For this month</span>
                </div>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ghost">
                <div className="flex items-center gap-2">
                    <span className="h-4 w-2 bg-primary" aria-hidden />
                    <span><strong className="font-medium text-foreground">117</strong> total order received by Vitalb</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-4 w-2 bg-slider-track" aria-hidden />
                    <span><strong className="font-medium text-foreground">12</strong> total order received by browsing</span>
                </div>
            </div>
        </AppSection>
    )
}
