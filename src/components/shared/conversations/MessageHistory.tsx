import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import AppCard from "@/components/design/AppCard"
import { ChatInput } from "@/components/shared/chatBox"
import { Button } from "@/components/ui/button"
import { noop } from "@/lib/utils"
import { type ConversationMessage } from "./conversationData"
import { ConversationsMessage } from "./ConversationsMessages"

export function MessageHistory({ messages, onCorrect, onSend, alwaysShowChatInput, onBack }: {
    messages: ConversationMessage[]
    onCorrect: (id: string, content: string) => void
    onSend: (content: string) => void
    alwaysShowChatInput: boolean
    onBack: () => void
}) {
    const [isTakeoverActive, setIsTakeoverActive] = useState(false)
    const showChatInput = alwaysShowChatInput || isTakeoverActive

    return (
        <AppCard padding="sm" className="flex h-full min-h-0 flex-col" shadow={false}>
            <div className="flex items-center justify-between gap-3 border-b border-section-border pb-3">
                <div className="flex min-w-0 items-center gap-2">
                    <Button
                        variant="bare"
                        className="rounded-full lg:hidden"
                        onClick={onBack}
                        aria-label="Back to chats"
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <p className="truncate text-lg font-medium text-foreground">Conversational history</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="bare" size="sm">Mark unread</Button>
                    <Button variant="bare" size="sm">Archive</Button>
                    <Button variant="secondary" size="xsm" onClick={() => setIsTakeoverActive(true)}>
                        Takeover
                    </Button>
                </div>
            </div>
            {/* Feedback, debug and approve endpoints aren't available yet — the controls stay
                visible so the panel matches the design. */}
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4">
                {messages.map((message) => (
                    <ConversationsMessage
                        key={message.id}
                        {...message}
                        onCorrect={message.sender === "bot" ? onCorrect : undefined}
                        onDebug={message.sender === "bot" ? noop : undefined}
                        onLike={message.sender === "bot" ? noop : undefined}
                        onDislike={message.sender === "bot" ? noop : undefined}
                        onApprove={message.sender === "bot" ? noop : undefined}
                    />
                ))}
            </div>
            {showChatInput && (
                <ChatInput
                    onSend={onSend}
                    placeholder="Ask Vitalb"
                    primaryColor="var(--widget-foreground)"
                />
            )}
        </AppCard>
    )
}
