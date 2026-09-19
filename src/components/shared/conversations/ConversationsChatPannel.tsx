import { Fragment, useState } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SelectField } from "@/components/design/SelectField"
import { ChatInput } from "@/components/shared/chatBox"
import CopyField from "@/components/shared/CopyField"
import { conversationMessages, conversations, type Conversation, type ConversationMessage } from "./conversationData"
import AppCard from "@/components/design/AppCard"
import Heading from "@/components/design/Heading"
import { ConversationsMessage } from "./ConversationsMessages"

// Feedback, debug and approve endpoints aren't available yet — the controls stay
// visible so the panel matches the design.
const noop = () => { }

function ConversationList({ selectedId, onSelect }: { selectedId: number; onSelect: (id: number) => void }) {
    return (
        <div className="flex min-w-0 flex-col gap-5.5">
            {conversations.map((conversation) => (
                <button
                    key={conversation.id}
                    type="button"
                    onClick={() => onSelect(conversation.id)}
                    className={`w-full border-l-2 p-1.5 text-left cursor-pointer transition-colors ${conversation.id === selectedId
                        ? "border-primary bg-interactive-active-background"
                        : "border-transparent hover:bg-surface-subtle"
                        }`}
                >
                    <div className="flex items-center justify-between gap-1.5">
                        <span className="flex min-w-0 items-center gap-1 mb-1.5">
                            <span aria-hidden className="size-2 shrink-0 rounded-full bg-content-strong" />
                            <span className="truncate text-sm font-bold text-foreground">{conversation.name}</span>
                        </span>
                        <span className="shrink-0 text-xs font-semibold">{conversation.time}</span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{conversation.preview}</p>
                </button>
            ))}
        </div>
    )
}

function MessageHistory({ messages, onCorrect, onSend, alwaysShowChatInput }: {
    messages: ConversationMessage[]
    onCorrect: (id: string, content: string) => void
    onSend: (content: string) => void
    alwaysShowChatInput: boolean
}) {
    const [isTakeoverActive, setIsTakeoverActive] = useState(false)
    const showChatInput = alwaysShowChatInput || isTakeoverActive

    return (
        <AppCard padding="sm" className="flex h-full min-h-0 flex-col" shadow={false}>
            <div className="flex items-center justify-between gap-3 border-b border-section-border pb-3">
                <p className="text-lg font-medium text-foreground">Conversational history</p>
                <div className="flex items-center gap-2">
                    <Button variant="bare" size="sm">Mark unread</Button>
                    <Button variant="bare" size="sm">Archive</Button>
                    <Button variant="secondary" size="xsm" onClick={() => setIsTakeoverActive(true)}>
                        Takeover
                    </Button>
                </div>
            </div>
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

function CustomerDetails({ conversation }: { conversation: Conversation }) {
    const details = [
        { label: "Name", value: conversation.name },
        { label: "Email", value: conversation.email },
        { label: "Phone", value: conversation.phone },
        { label: "Location", value: conversation.location },
    ]

    return (
        <div className="flex min-w-0 flex-col gap-4">
            <div>
                <div className="mb-2.5 flex items-center justify-between gap-2">
                    <Heading size="md" className="font-semibold">Assignee</Heading>
                    <Button variant="bare" size="sm">Add note</Button>
                </div>
                <SelectField
                    value="vitalb-ai"
                    onValueChange={noop}
                    placeholder="Assign"
                    options={[{ value: "vitalb-ai", label: "Vitalb ai" }]}
                />
            </div>

            <div className="border-t border-section-border pt-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <Heading size="md" className="font-semibold">Customer details</Heading>
                    <ChevronRight className="size-4 text-content-muted" />
                </div>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                    {details.map((detail) => (
                        <Fragment key={detail.label}>
                            <dt className="text-content-muted">{detail.label}</dt>
                            <dd className="truncate text-foreground">{detail.value}</dd>
                        </Fragment>
                    ))}
                </dl>
            </div>

            <div className="border-t border-section-border pt-4">
                <div className="mb-2.5 flex items-center justify-between gap-2">
                    <Heading size="md" className="font-semibold">Share URL</Heading>
                    <ChevronRight className="size-4 text-content-muted" />
                </div>
                <CopyField value={conversation.shareUrl} />
            </div>
        </div>
    )
}

interface ConversationsChatPannelProps {
    alwaysShowChatInput?: boolean
}

export function ConversationsChatPannel({ alwaysShowChatInput = false }: ConversationsChatPannelProps) {
    const [selectedId, setSelectedId] = useState(conversations[0].id)
    const [messages, setMessages] = useState(conversationMessages)

    const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0]

    function handleCorrect(id: string, content: string) {
        setMessages((current) => current.map((message) => message.id === id ? { ...message, content } : message))
    }

    function handleSend(content: string) {
        setMessages((current) => [
            ...current,
            { id: crypto.randomUUID(), content, sender: "user" },
        ])
    }

    return (
        <div className="grid h-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(180px,1fr)_minmax(0,3fr)_minmax(176px,1fr)] lg:gap-3.5">
            <ConversationList selectedId={selectedId} onSelect={setSelectedId} />
            <MessageHistory
                messages={messages}
                onCorrect={handleCorrect}
                onSend={handleSend}
                alwaysShowChatInput={alwaysShowChatInput}
            />
            <CustomerDetails conversation={selectedConversation} />
        </div>
    )
}
