import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const tips = [
    "Setup Escalate Conversations",
    "Enable agentic search",
    "Setup proactive chats",
    "Invite your colleagues",
];

export default function Tips() {
    return (
        <AppSection>
            <div className="w-full flex items-center justify-between">
                <Heading>Tips</Heading>
                <Button size="sm" variant="underline-bare">Show all</Button>
            </div>
            <div className="w-full flex flex-col">
                {tips.map((tip) => (
                    <button
                        key={tip}
                        type="button"
                        className="flex items-center cursor-pointer justify-between gap-3 py-1.5 text-left text-base text-foreground transition-colors hover:text-primary"
                    >
                        <span>{tip}</span>
                        <ChevronRight className="size-4 shrink-0 text-content-muted" aria-hidden />
                    </button>
                ))}
            </div>
        </AppSection>
    )
}
