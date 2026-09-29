import type { Ref } from "react"
import { useConversationFilterStore } from "@/features/conversations/conversationFilterStore"
import { conversations } from "./conversationData"

export function ConversationList({ selectedId, onSelect, selectedButtonRef }: { selectedId: number; onSelect: (id: number) => void; selectedButtonRef?: Ref<HTMLButtonElement> }) {
    const searchQuery = useConversationFilterStore((state) => state.searchQuery)
    const query = searchQuery.trim().toLowerCase()
    const visibleConversations = query
        ? conversations.filter((conversation) =>
            conversation.name.toLowerCase().includes(query) || conversation.preview.toLowerCase().includes(query))
        : conversations

    return (
        <div className="flex min-w-0 flex-col gap-5.5">
            {visibleConversations.length === 0 && (
                <p className="text-sm text-content-muted">No chats match your search.</p>
            )}
            {visibleConversations.map((conversation) => (
                <button
                    key={conversation.id}
                    ref={conversation.id === selectedId ? selectedButtonRef : undefined}
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
