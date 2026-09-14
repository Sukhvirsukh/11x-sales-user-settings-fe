
import { useState } from "react"
import { Archive, CheckCheck, ChevronRight, Copy, MoreHorizontal, ThumbsDown, ThumbsUp } from "lucide-react"
import AppCard from "@/components/design/AppCard"
import { Button } from "@/components/ui/button"
import { conversations, type Conversation } from "./conversationData"

const messages = [
    { id: 1, text: "Welcome to Vitalb. How can I help you today?", sender: "assistant" },
    { id: 2, text: "What is there in your brand?", sender: "customer" },
    { id: 3, text: "We help stores give customers fast, accurate answers at every stage of their journey.", sender: "assistant" },
]

function ConversationItem({ conversation, selected, onSelect }: {
    conversation: Conversation
    selected: boolean
    onSelect: () => void
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`w-full rounded-lg p-3 text-left transition-colors ${selected ? "bg-active-bg" : "hover:bg-light"}`}
        >
            <div className="mb-1 flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-foreground">{conversation.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{conversation.time}</span>
            </div>
            <p className="truncate text-sm text-muted-foreground">{conversation.preview}</p>
        </button>
    )
}

function ConversationList({ selectedId, onSelect }: { selectedId: number; onSelect: (id: number) => void }) {
    return (
        <AppCard padding="sm">
            <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-sm font-medium text-foreground">Conversations</p>
                <span className="text-xs text-muted-foreground">{conversations.length} open</span>
            </div>
            <div className="space-y-1">
                {conversations.map((conversation) => (
                    <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        selected={conversation.id === selectedId}
                        onSelect={() => onSelect(conversation.id)}
                    />
                ))}
            </div>
        </AppCard>
    )
}

function MessageHistory({ conversation }: { conversation: Conversation }) {
    return (
        <AppCard padding="sm" className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-border px-2 pb-3">
                <div>
                    <p className="text-base font-medium text-foreground">Conversation history</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{conversation.channel} · {conversation.name}</p>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="bare" size="xs" aria-label="Mark as unread"><CheckCheck className="size-4" /></Button>
                    <Button variant="bare" size="xs" aria-label="Archive conversation"><Archive className="size-4" /></Button>
                    <Button variant="bare" size="xs" aria-label="More actions"><MoreHorizontal className="size-4" /></Button>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-4">
                {messages.map((message) => (
                    <div key={message.id} className={message.sender === "customer" ? "ml-auto max-w-[80%]" : "max-w-[85%]"}>
                        <div className={`rounded-xl px-3 py-2 text-sm ${message.sender === "customer" ? "bg-primary text-primary-fg" : "bg-light text-foreground"}`}>
                            {message.text}
                        </div>
                        {message.sender === "assistant" && (
                            <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                                <Button variant="bare" size="xs" aria-label="Helpful"><ThumbsUp className="size-3.5" /></Button>
                                <Button variant="bare" size="xs" aria-label="Not helpful"><ThumbsDown className="size-3.5" /></Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AppCard>
    )
}

function CustomerDetails({ conversation }: { conversation: Conversation }) {
    return (
        <AppCard padding="sm" >
            <div className="border-b border-border pb-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Assignee</p>
                    <Button variant="bare" size="xs">Add note</Button>
                </div>
                <div className="mt-2 rounded-lg bg-light px-3 py-2 text-sm text-foreground">Vitalb AI</div>
            </div>
            <div className="border-b border-border py-4">
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Customer details</p>
                    <ChevronRight className="size-4 text-muted-foreground" />
                </div>
                <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Name</dt><dd className="text-foreground">{conversation.name}</dd></div>
                    <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Channel</dt><dd className="text-foreground">{conversation.channel}</dd></div>
                    <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Location</dt><dd className="text-foreground">India</dd></div>
                </dl>
            </div>
            <div className="pt-4">
                <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Share URL</p>
                    <ChevronRight className="size-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-light p-2">
                    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">https://app.vitalb.ai/conversations/{conversation.id}</span>
                    <Button variant="bare" size="xs" aria-label="Copy conversation URL"><Copy className="size-3.5" /></Button>
                </div>
            </div>
        </AppCard>
    )
}

export function ConversationsChatPannel() {
    const [selectedId, setSelectedId] = useState(conversations[0].id)
    const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0]

    return (
        <div className="grid h-full gap-3 lg:grid-cols-[220px_minmax(0,1fr)_240px]">
            <ConversationList selectedId={selectedId} onSelect={setSelectedId} />
            <MessageHistory conversation={selectedConversation} />
            <CustomerDetails conversation={selectedConversation} />
        </div>
    )
}
