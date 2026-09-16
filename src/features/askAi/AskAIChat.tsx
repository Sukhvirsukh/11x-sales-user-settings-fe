import { useState } from "react";
import Heading from "@/components/design/Heading";
import { ChatInput, ChatMessage } from "@/components/shared/chatBox";

type Message = {
    id: string;
    content: string;
    sender: "user" | "bot";
};

export default function AskAIChat() {
    const [messages, setMessages] = useState<Message[]>([]);

    function handleSend(content: string) {
        setMessages((current) => [
            ...current,
            { id: crypto.randomUUID(), content, sender: "user" },
            {
                id: crypto.randomUUID(),
                content: "Thanks for your question. I’m here to help you with that.",
                sender: "bot",
            },
        ]);
    }

    return (
        <div className="flex h-full w-full min-h-0 flex-col">
            {messages.length > 0 ? (
                <div aria-live="polite" className="min-h-0 w-full flex-1 overflow-y-auto px-2 py-4">
                    <div className="flex w-full flex-col gap-4">
                        {messages.map((message) => <ChatMessage key={message.id} {...message} />)}
                    </div>
                </div>
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <Heading size="2xl" className="text-2xl md:text-3xl">
                        Hi there, How can I help you?
                    </Heading>
                    <p className="mt-6 max-w-182 text-sm text-gray">
                        How do I connect Shopify? How do I add a WhatsApp integration? Why isn't my chatbot responding? How do I invite another team member?
                    </p>
                </div>
            )}

            <ChatInput
                onSend={handleSend}
                placeholder="Search or type your question..."
                variant="default"
            />
        </div>
    );
}
