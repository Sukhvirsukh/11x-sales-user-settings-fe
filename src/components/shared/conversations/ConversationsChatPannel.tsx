import { Fragment, useState } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SelectField } from "@/components/design/SelectField"
import { ChatMessage } from "@/components/shared/chatBox"
import CopyField from "@/components/shared/CopyField"
import { conversationMessages, conversations, type Conversation, type ConversationMessage } from "./conversationData"

// Feedback, debug and approve endpoints aren't available yet — the controls stay
// visible so the panel matches the design.
const noop = () => { }

function ConversationList({ selectedId, onSelect }: { selectedId: number; onSelect: (id: number) => void }) {
    return (
        <div className="flex min-w-0 flex-col divide-y divide-border-subtle border-section-border lg:border-r">
            {conversations.map((conversation) => (
                <button
                    key={conversation.id}
                    type="button"
                    onClick={() => onSelect(conversation.id)}
                    className={`w-full border-l-2 px-2.5 py-2.5 text-left transition-colors ${conversation.id === selectedId
                        ? "border-primary bg-active-bg"
                        : "border-transparent hover:bg-light"
                        }`}
                >
                    <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">{conversation.name}</span>
                        <span className="shrink-0 text-xs text-ghost">{conversation.time}</span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{conversation.preview}</p>
                </button>
            ))}
        </div>
    )
}

function MessageHistory({ messages, onCorrect }: {
    messages: ConversationMessage[]
    onCorrect: (id: string, content: string) => void
}) {
    return (
        <div className="flex min-w-0 flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-section-border px-3 pb-3">
                <p className="text-base font-semibold text-foreground">Conversational history</p>
                <div className="flex items-center gap-2">
                    <Button variant="bare" size="sm">Mark unread</Button>
                    <Button variant="bare" size="sm">Archive</Button>
                    <Button variant="secondary" size="sm">Takeover</Button>
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4">
                {messages.map((message) => (
                    <ChatMessage
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
        </div>
    )
}

function CustomerDetails({ conversation }: { conversation: Conversation }) {
    const details = [
        { label: "Name", value: conversation.name },
        { label: "Mail Id", value: conversation.email },
        { label: "Phone", value: conversation.phone },
        { label: "Location", value: conversation.location },
    ]

    return (
        <div className="flex min-w-0 flex-col gap-4 border-section-border lg:border-l lg:pl-3">
            <div>
                <div className="mb-2.5 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">Assignee</p>
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
                    <p className="text-sm font-medium text-foreground">Customer details</p>
                    <ChevronRight className="size-4 text-gray" />
                </div>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                    {details.map((detail) => (
                        <Fragment key={detail.label}>
                            <dt className="text-ghost">{detail.label}</dt>
                            <dd className="truncate text-foreground">{detail.value}</dd>
                        </Fragment>
                    ))}
                </dl>
            </div>

            <div className="border-t border-section-border pt-4">
                <div className="mb-2.5 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">Share URL</p>
                    <ChevronRight className="size-4 text-gray" />
                </div>
                <CopyField value={conversation.shareUrl} />
            </div>
        </div>
    )
}

export function ConversationsChatPannel() {
    const [selectedId, setSelectedId] = useState(conversations[0].id)
    const [messages, setMessages] = useState(conversationMessages)

    const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0]

    function handleCorrect(id: string, content: string) {
        setMessages((current) => current.map((message) => message.id === id ? { ...message, content } : message))
    }

    return (
        <div className="grid h-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-[170px_minmax(0,1fr)_230px] lg:gap-0">
            <ConversationList selectedId={selectedId} onSelect={setSelectedId} />
            <MessageHistory messages={messages} onCorrect={handleCorrect} />
            <CustomerDetails conversation={selectedConversation} />
        </div>
    )
}
