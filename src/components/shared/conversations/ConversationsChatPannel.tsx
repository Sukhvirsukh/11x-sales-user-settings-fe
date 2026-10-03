import { Fragment, useMemo, useState } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatInput } from "@/components/shared/chatBox"
import CopyField from "@/components/shared/CopyField"
import AppCard from "@/components/design/AppCard"
import Heading from "@/components/design/Heading"
import { toast } from "@/components/ui/toast"
import { agentApiConfigured } from "@/lib/agentApi"
import { useConversationFilterStore } from "@/features/conversations/conversationFilterStore"
import type { AgentConversation, AgentMessage, ConversationTab } from "@/features/conversations/api/conversationsApi"
import {
    useConversationMutations,
    useConversationQuery,
    useConversationsQuery,
} from "@/features/conversations/api/conversationsQuery"
import { ConversationsMessage } from "./ConversationsMessages"

// The filter sidebar's channel labels -> the agent's channel names.
const CHANNELS: Record<string, string> = { Website: "web", WhatsApp: "whatsapp", Facebook: "messenger", Instagram: "instagram", Email: "email" }

const displayName = (c: AgentConversation) => c.customer_name || c.customer_email || c.customer_phone || "Visitor"
const pagePath = (url: string | null) => (url ? url.replace(/^https?:\/\/[^/]+/, "") || "/" : "—")

function formatTime(iso: string | null) {
    if (!iso) return ""
    const date = new Date(iso)
    const sameDay = date.toDateString() === new Date().toDateString()
    return sameDay
        ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
        : date.toLocaleDateString([], { day: "2-digit", month: "short" })
}

function EmptyState({ children }: { children: React.ReactNode }) {
    return <p className="p-6 text-center text-sm text-muted-foreground">{children}</p>
}

function ConversationList({ conversations, selectedId, onSelect }: {
    conversations: AgentConversation[]
    selectedId: string | null
    onSelect: (id: string) => void
}) {
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
                            <span aria-hidden className={`size-2 shrink-0 rounded-full ${conversation.unread ? "bg-primary" : "bg-content-strong"}`} />
                            <span className="truncate text-sm font-bold text-foreground">{displayName(conversation)}</span>
                        </span>
                        <span className="shrink-0 text-xs font-semibold">{formatTime(conversation.last_message_at)}</span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{(conversation.preview ?? "").replace(/\*\*(.+?)\*\*/g, "$1")}</p>
                    <p className="mt-1 flex flex-wrap gap-1.5 text-xs text-content-muted">
                        <span className="capitalize">{conversation.channel}</span>
                        {conversation.status === "escalated" && <span className="text-destructive">Escalated</span>}
                        {conversation.manual_mode && <span>Manual replies</span>}
                        {(conversation.orders ?? 0) > 0 && <span>Sale</span>}
                    </p>
                </button>
            ))}
        </div>
    )
}

function MessageHistory({ conversationId, conversation, messages, alwaysShowChatInput }: {
    conversationId: string
    conversation: AgentConversation
    messages: AgentMessage[]
    alwaysShowChatInput: boolean
}) {
    const { action, reply, correct } = useConversationMutations(conversationId)
    const showChatInput = alwaysShowChatInput || conversation.manual_mode
    const visible = messages.filter((m) => m.role !== "system")

    // The shopper question a reply answered, used as the correction's question.
    function questionBefore(messageId: number) {
        const index = messages.findIndex((m) => m.id === messageId)
        return [...messages.slice(0, index)].reverse().find((m) => m.role === "user")?.content ?? ""
    }

    function handleCorrect(id: string, answer: string) {
        const messageId = Number(id)
        const question = questionBefore(messageId)
        if (!question) return
        correct.mutate(
            { question, answer, messageId },
            { onSuccess: () => toast.add({ type: "success", title: "Correction saved", description: "The agent uses it from the next message." }) },
        )
    }

    return (
        <AppCard padding="sm" className="flex h-full min-h-0 flex-col" shadow={false}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-section-border pb-3">
                <p className="text-lg font-medium text-foreground">Conversational history</p>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="bare" size="sm" disabled={action.isPending} onClick={() => action.mutate({ action: "unread", body: { unread: true } })}>
                        Mark unread
                    </Button>
                    <Button variant="bare" size="sm" disabled={action.isPending} onClick={() => action.mutate({ action: "archive", body: { archived: !conversation.archived } })}>
                        {conversation.archived ? "Unarchive" : "Archive"}
                    </Button>
                    <Button
                        variant="bare"
                        size="sm"
                        disabled={action.isPending}
                        onClick={() => action.mutate({ action: conversation.status === "resolved" ? "unresolve" : "resolve" })}
                    >
                        {conversation.status === "resolved" ? "Undo resolve" : "Resolve"}
                    </Button>
                    <Button
                        variant="secondary"
                        size="xsm"
                        disabled={action.isPending}
                        onClick={() => action.mutate({ action: conversation.manual_mode ? "handback" : "takeover" })}
                    >
                        {conversation.manual_mode ? "Enable AI replies" : "Takeover"}
                    </Button>
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4">
                {visible.map((message) => {
                    // Only real AI answers can be corrected, not the welcome message.
                    const fromAi = message.role === "assistant" && message.sender !== "welcome"
                    const text = message.content.replace(/\*\*(.+?)\*\*/g, "$1")
                    return (
                        <ConversationsMessage
                            key={message.id}
                            id={String(message.id)}
                            content={message.role === "human" ? `${message.sender ?? "Team"}: ${text}` : text}
                            sender={message.role === "user" ? "user" : "bot"}
                            onCorrect={fromAi ? handleCorrect : undefined}
                        />
                    )
                })}
            </div>
            {showChatInput && (
                <ChatInput
                    onSend={(text) => reply.mutate(text)}
                    placeholder="Reply to the customer"
                    primaryColor="var(--widget-foreground)"
                />
            )}
        </AppCard>
    )
}

function CustomerDetails({ conversation, shareUrl }: { conversation: AgentConversation; shareUrl: string }) {
    const details = [
        { label: "Name", value: conversation.customer_name ?? "—" },
        { label: "Email", value: conversation.customer_email ?? "—" },
        { label: "Phone", value: conversation.customer_phone ?? "—" },
        { label: "Channel", value: conversation.channel },
        { label: "Started on", value: pagePath(conversation.start_page) },
        { label: "Assignee", value: conversation.assignee ?? "AI" },
    ]

    return (
        <div className="flex min-w-0 flex-col gap-4">
            <div className="border-t border-section-border pt-4 lg:border-t-0 lg:pt-0">
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

            {conversation.summary && (
                <div className="border-t border-section-border pt-4">
                    <Heading size="md" className="mb-2 font-semibold">Summary</Heading>
                    <p className="text-sm text-foreground">{conversation.summary}</p>
                    {conversation.sentiment && <p className="mt-1 text-xs capitalize text-content-muted">Sentiment: {conversation.sentiment}</p>}
                </div>
            )}

            <div className="border-t border-section-border pt-4">
                <div className="mb-2.5 flex items-center justify-between gap-2">
                    <Heading size="md" className="font-semibold">Share URL</Heading>
                    <ChevronRight className="size-4 text-content-muted" />
                </div>
                <CopyField value={shareUrl} />
            </div>
        </div>
    )
}

interface ConversationsChatPannelProps {
    tab?: ConversationTab
    alwaysShowChatInput?: boolean
}

export function ConversationsChatPannel({ tab = "active", alwaysShowChatInput = false }: ConversationsChatPannelProps) {
    const searchQuery = useConversationFilterStore((state) => state.searchQuery)
    const channelFilters = useConversationFilterStore((state) => state.selectedFilters.Channels ?? [])
    // One channel is filtered on the server; several are filtered here.
    const channels = channelFilters.map((label) => CHANNELS[label]).filter(Boolean)
    const list = useConversationsQuery(tab, searchQuery, channels.length === 1 ? channels[0] : undefined)
    const conversations = useMemo(
        () => (list.data?.conversations ?? []).filter((c) => channels.length <= 1 || channels.includes(c.channel)),
        [list.data, channels],
    )

    const [chosenId, setSelectedId] = useState<string | null>(null)
    // Fall back to the newest conversation when nothing (or a conversation no longer listed) is chosen.
    const selectedId = conversations.some((c) => c.id === chosenId) ? chosenId : conversations[0]?.id ?? null
    const detail = useConversationQuery(selectedId)

    if (!agentApiConfigured) return <EmptyState>The AI agent isn't connected yet.</EmptyState>
    if (list.isLoading) return <EmptyState>Loading conversations…</EmptyState>
    if (list.isError) return <EmptyState>Couldn't load conversations. {list.error.message}</EmptyState>
    if (!conversations.length) return <EmptyState>No conversations here yet.</EmptyState>

    return (
        <div className="grid h-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(180px,1fr)_minmax(0,3fr)_minmax(176px,1fr)] lg:gap-3.5">
            <ConversationList conversations={conversations} selectedId={selectedId} onSelect={setSelectedId} />
            {detail.data && selectedId ? (
                <>
                    <MessageHistory
                        conversationId={selectedId}
                        conversation={detail.data.conversation}
                        messages={detail.data.messages}
                        alwaysShowChatInput={alwaysShowChatInput}
                    />
                    <CustomerDetails conversation={detail.data.conversation} shareUrl={detail.data.shareUrl} />
                </>
            ) : (
                <EmptyState>{detail.isError ? "Couldn't load this conversation." : "Loading…"}</EmptyState>
            )}
        </div>
    )
}
