import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Paperclip, SendHorizontal } from "lucide-react";
import AppCard from "@/components/design/AppCard";
import Heading from "@/components/design/Heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
    id: string;
    content: string;
    sender: "user" | "ai";
};

export default function AskAIChat() {
    const [draft, setDraft] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    function sendMessage() {
        const content = draft.trim();
        if (!content) return;

        setMessages((current) => [
            ...current,
            { id: crypto.randomUUID(), content, sender: "user" },
            {
                id: crypto.randomUUID(),
                content: "Thanks for your question. I’m here to help you with that.",
                sender: "ai",
            },
        ]);
        setDraft("");
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        sendMessage();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="flex h-full w-full min-h-0 flex-col">
            {messages.length > 0 ? (
                <div aria-live="polite" className="min-h-0 w-full flex-1 overflow-y-auto px-2 py-4">
                    <div className="flex w-full flex-col gap-4">
                        {messages.map((message) => (
                            <p
                                key={message.id}
                                className={`w-fit max-w-[80%] rounded-[10px] p-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words text-black shadow-[0_2px_4px_rgba(0,0,0,0.06),_0_8px_24px_rgba(0,0,0,0.10)] ${message.sender === "user" ? "self-end bg-[#E2E2E2]" : "self-start bg-[#EEE]"}`}
                            >
                                {message.content}
                            </p>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <Heading size="2xl" className="text-2xl md:text-3xl">
                        Hi there, How can I help you?
                    </Heading>
                    <p className="mt-6 max-w-[728px] text-sm text-gray">
                        How do I connect Shopify? How do I add a WhatsApp integration? Why isn't my chatbot responding? How do I invite another team member?
                    </p>
                </div>
            )}

            <AppCard padding="sm" className="shrink-0 h-20">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <Input
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search or type your question..."
                        aria-label="Ask a question"
                    />
                    <input ref={fileInputRef} type="file" className="sr-only" />
                    <Button
                        type="button"
                        variant="bare"
                        size="sm"
                        className="gap-1.5 text-xs text-gray"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <span className="hidden sm:inline">Attach file</span>
                        <Paperclip className="size-4" aria-hidden="true" />
                    </Button>
                    <span aria-hidden="true" className="h-5 border-l border-section-border" />
                    <Button type="submit" variant="bare" size="sm" aria-label="Send message" disabled={!draft.trim()}>
                        <SendHorizontal className="size-4" aria-hidden="true" />
                    </Button>
                </form>
            </AppCard>
        </div>
    );
}
