import type { Ref } from "react"
import { ChevronLeft } from "lucide-react"
import AppCard from "@/components/design/AppCard"
import AppSection from "@/components/design/AppSectoin"
import { ChatInput } from "@/components/shared/chatBox"
import { Button } from "@/components/ui/button"
import { noop } from "@/lib/utils"
import { type ConversationMessage } from "./conversationData"
import { ConversationsMessage } from "./ConversationsMessages"
import { useViewpoint } from "@/hooks/useViewpoint"

export function MessageHistory({ messages, onCorrect, onSend, alwaysShowChatInput, onBack, draft, onDraftChange, isTakeoverActive, onTakeover, headingRef }: {
    messages: ConversationMessage[]
    onCorrect: (id: string, content: string) => void
    onSend: (content: string) => void
    alwaysShowChatInput: boolean
    onBack: () => void
    draft: string
    onDraftChange: (value: string) => void
    isTakeoverActive: boolean
    onTakeover: () => void
    headingRef: Ref<HTMLParagraphElement>
}) {
    const showChatInput = alwaysShowChatInput || isTakeoverActive
    const isBelowLg = !useViewpoint("lg")

    return (
        <AppCard padding="sm" className="flex h-full min-h-0 flex-col border-0 p-0 lg:border lg:p-2.5" shadow={false}>
            <div className="flex items-center justify-between gap-3 border-b border-section-border lg:pb-2.5 pb-1.25">
                <div className="flex min-w-0 items-center gap-2">
                    <Button
                        variant="bare"
                        className="rounded-full lg:hidden"
                        onClick={onBack}
                        aria-label="Back to chats"
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <p ref={headingRef} tabIndex={-1} className="truncate text-lg font-medium text-foreground">Conversational history</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="bare" size="sm">Mark unread</Button>
                    <Button variant="bare" size="sm">Archive</Button>
                    <Button variant="secondary" size="xsm" onClick={onTakeover}>
                        Takeover
                    </Button>
                </div>
            </div>
            {/* Feedback, debug and approve endpoints aren't available yet — the controls stay
                visible so the panel matches the design. */}
            <AppSection
                className="lg:mt-0 mt-3.5 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pt-4 items-stretch"
                /*className="h-auto min-h-0 flex-1 mt-3.5 lg:mt-0 items-stretch overflow-y-auto py-4 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:py-4"*/>
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

                {showChatInput && (
                    <div className="mt-auto">
                        <ChatInput
                            value={draft}
                            onValueChange={onDraftChange}
                            onSend={onSend}
                            placeholder="Ask Vitalb"
                            primaryColor="var(--widget-foreground)"
                            variant={isBelowLg ? 'default' : "light"}
                        />
                    </div>
                )}
            </AppSection>
        </AppCard>
    )
}
