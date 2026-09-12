import AppCard from "@/components/design/AppCard";
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
        <AppCard
            header="Tips"
            headingSize="lg"
            shadow
            actions={
                <Button variant="action">Show all</Button>
            }
        >
            <div className="flex flex-col">
                {tips.map((tip) => (
                    <button
                        key={tip}
                        type="button"
                        className="flex items-center cursor-pointer justify-between gap-3 py-1.5 text-left text-base text-foreground transition-colors hover:text-primary"
                    >
                        <span>{tip}</span>
                        <ChevronRight className="size-4 shrink-0 text-ghost" aria-hidden />
                    </button>
                ))}
            </div>
        </AppCard>
    )
}
