import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import PreviewSection from "@/components/design/PreviewSection";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { agentApiConfigured } from "@/lib/agentApi";
import { cn } from "@/lib/utils";
import AskAIChat from "./AskAIChat";
import { askThreadsQueryKey, getThreads, type AskThread } from "./askApi";

/** Groups conversations into Today, Yesterday and Earlier, keeping their order. */
function groupByDay(threads: AskThread[]) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const groups: { label: string; threads: AskThread[] }[] = [
        { label: "Today", threads: [] },
        { label: "Yesterday", threads: [] },
        { label: "Earlier", threads: [] },
    ];
    for (const thread of threads) {
        const updated = new Date(thread.updatedAt);
        const group = updated >= startOfToday ? groups[0] : updated >= startOfYesterday ? groups[1] : groups[2];
        group.threads.push(thread);
    }
    return groups.filter((group) => group.threads.length > 0);
}

export function AskAI() {
    const [threadId, setThreadId] = useState<string | null>(null);
    const threads = useQuery({ queryKey: askThreadsQueryKey, queryFn: getThreads, enabled: agentApiConfigured });
    const groups = groupByDay(threads.data ?? []);

    return (
        <PreviewSection>
            <div className="flex w-full flex-col gap-3.5 md:flex-row">
                <AppSection className="h-[80vh] min-w-0 flex-1 justify-between md:py-7.5 md:px-5">
                    {/* Keyed so switching conversations starts from that conversation's saved messages. */}
                    <AskAIChat key={threadId ?? "new"} threadId={threadId} onThreadChange={setThreadId} />
                </AppSection>
                <div className="flex w-full flex-col gap-3.5 md:w-auto md:flex-row md:self-start">
                    <Separator className="md:hidden" />
                    <Separator orientation="vertical" className="hidden md:block" />
                    <aside className="w-full shrink-0 md:w-[230px]">
                        <div className="mb-4 flex items-center justify-between gap-2">
                            <Heading size="md" className="font-semibold">History</Heading>
                            <Button variant="bare" size="sm" onClick={() => setThreadId(null)} disabled={threadId === null}>
                                <Plus className="size-4" /> New chat
                            </Button>
                        </div>
                        {groups.length === 0 ? (
                            <p className="text-sm text-content-muted">
                                {threads.isLoading ? "Loading…" : "Your questions will appear here."}
                            </p>
                        ) : (
                            <div className="flex flex-col gap-[30px]">
                                {groups.map((group) => (
                                    <div key={group.label}>
                                        <p className="text-sm text-content-muted">{group.label}</p>
                                        <ul className="my-1 space-y-1 text-base">
                                            {group.threads.map((thread) => (
                                                <li key={thread.id} className="my-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setThreadId(thread.id)}
                                                        className={cn(
                                                            "w-full truncate text-left hover:text-primary",
                                                            thread.id === threadId && "font-semibold text-primary",
                                                        )}
                                                        title={thread.title}
                                                    >
                                                        {thread.title}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </PreviewSection>
    )
}
