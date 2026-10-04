import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Heading from "@/components/design/Heading";
import { ChatInput, ChatMessage } from "@/components/shared/chatBox";
import { agentApiConfigured } from "@/lib/agentApi";
import { queryClient } from "@/lib/queryClient";
import { useCan } from "../auth";
import { ask, askThreadQueryKey, askThreadsQueryKey, getThread } from "./askApi";

type Message = {
    id: string;
    content: string;
    sender: "user" | "bot";
};

/** Starter questions: one about the product, the rest about the store's own numbers. */
const SUGGESTIONS = [
    "How do I connect Shopify?",
    "How much did chat sell in the last 30 days?",
    "What are shoppers asking about most?",
    "Why isn't my agent replying?",
];

const NO_PERMISSION = "Sorry! You don't have permission to use this feature. Please ask your administrator.";

interface AskAIChatProps {
    /** The conversation to show; null starts a new one. */
    threadId: string | null;
    /** Called when a new conversation gets its id after the first answer. */
    onThreadChange: (threadId: string) => void;
}

export default function AskAIChat({ threadId, onThreadChange }: AskAIChatProps) {
    const canAsk = useCan("askMe.create")
    // Shown on top of the saved conversation while an answer is on its way, or when the agent isn't connected.
    const [pending, setPending] = useState<Message[]>([]);

    const thread = useQuery({
        queryKey: askThreadQueryKey(threadId ?? "new"),
        queryFn: () => getThread(threadId!),
        enabled: agentApiConfigured && !!threadId,
    });

    const askMutation = useMutation({
        mutationFn: (text: string) => ask(text, threadId),
        onSuccess: async ({ threadId: id }) => {
            await queryClient.fetchQuery({ queryKey: askThreadQueryKey(id), queryFn: () => getThread(id) });
            void queryClient.invalidateQueries({ queryKey: askThreadsQueryKey });
            setPending([]);
            if (id !== threadId) onThreadChange(id);
        },
        onError: () => {
            setPending((current) => [
                ...current.filter((m) => m.id !== "thinking"),
                { id: crypto.randomUUID(), content: "Sorry, I couldn't answer that. Please try again.", sender: "bot" },
            ]);
        },
    });

    function handleSend(content: string) {
        const question: Message = { id: crypto.randomUUID(), content, sender: "user" };
        if (!canAsk) {
            return setPending((current) => [...current, question, { id: crypto.randomUUID(), content: NO_PERMISSION, sender: "bot" }]);
        }
        if (!agentApiConfigured) {
            return setPending((current) => [
                ...current,
                question,
                { id: crypto.randomUUID(), content: "Thanks for your question. I’m here to help you with that.", sender: "bot" },
            ]);
        }
        setPending([question, { id: "thinking", content: "Thinking…", sender: "bot" }]);
        askMutation.mutate(content);
    }

    const saved: Message[] = (threadId ? thread.data ?? [] : []).map((m) => ({
        id: m.id,
        content: m.content,
        sender: m.role === "user" ? "user" : "bot",
    }));
    const messages = [...saved, ...pending];

    return (
        <div className="flex h-full w-full min-h-0 flex-col">
            {messages.length > 0 ? (
                <div aria-live="polite" className="min-h-0 w-full flex-1 overflow-y-auto px-2 py-4">
                    <div className="flex w-full flex-col gap-4">
                        {messages.map((message) => <ChatMessage key={message.id} {...message} />)}
                    </div>
                </div>
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center px-2 py-8 text-center">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                        <Sparkles className="size-5" aria-hidden="true" />
                    </span>
                    <Heading size="xlg" className="mt-4">
                        {thread.isLoading ? "Loading…" : "What would you like to know?"}
                    </Heading>
                    <p className="mt-1.5 max-w-md text-base text-muted-foreground">
                        Ask how something works in 11xSales, or about your store's chats, orders and sales.
                    </p>
                    {!thread.isLoading && (
                        <div className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
                            {SUGGESTIONS.map((question) => (
                                <button
                                    key={question}
                                    type="button"
                                    onClick={() => handleSend(question)}
                                    disabled={!canAsk || askMutation.isPending}
                                    className="rounded-full border border-border bg-surface-raised px-3.5 py-1.5 text-sm text-foreground shadow-panel transition-colors hover:border-border-strong hover:bg-control-hover disabled:opacity-50"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <ChatInput
                onSend={handleSend}
                placeholder="Ask a question…"
                variant="default"
                disabled={!canAsk || askMutation.isPending}
            />
        </div>
    );
}
