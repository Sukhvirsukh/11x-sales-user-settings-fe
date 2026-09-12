import AppCard from "@/components/design/AppCard";
import { Slider } from "@/components/ui/slider";
import { CheckCircle2, Circle } from "lucide-react";

export default function SetupProgress() {
    return (
        <AppCard
            header="Setup progress"
            headingSize="lg"
            shadow
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3 rounded-[10px] bg-active-bg p-2.5">
                    <span className="text-base text-foreground">2 of 4 steps completed</span>
                    <Slider
                        aria-label="Setup progress"
                        defaultValue={[50]}
                        className="pointer-events-none max-w-16 w-20 shrink-0 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-border [&_[data-slot=slider-range]]:bg-success [&_[data-slot=slider-thumb]]:hidden"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 fill-ghost text-background" aria-hidden />
                        <p className="text-base font-medium text-foreground">Customise the chat to fit your brand</p>
                    </div>

                    <div className="flex items-start gap-3">
                        <Circle className="mt-0.5 size-4.5 shrink-0 text-border" aria-hidden />
                        <div>
                            <p className="text-base font-medium text-foreground">Wait for Vitalb to index your site</p>
                            <p className="mt-1 text-sm leading-4 text-ghost">
                                We’re crawling your store to build the agent’s knowledge base. You’ll be notified when it’s ready.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Circle className="mt-0.5 size-4.5 shrink-0 text-border" aria-hidden />
                        <p className="text-base font-medium text-foreground">Test & Train your agent</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 fill-ghost text-background" aria-hidden />
                        <p className="text-base font-medium text-foreground">Install Vitalb extension</p>
                    </div>
                </div>
            </div>
        </AppCard>
    )
}
