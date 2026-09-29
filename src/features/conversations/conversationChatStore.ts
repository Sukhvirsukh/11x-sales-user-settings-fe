import { create } from "zustand"

interface ConversationChatState {
    /**
     * Below `lg` the thread overlaps the whole conversations panel — the toolbar
     * row with "All Chats", search and filters included — so the trigger lives in
     * the panel while the toolbar reads the same flag to lay itself under it.
     */
    isThreadOpen: boolean
    openThread: () => void
    closeThread: () => void
}

export const useConversationChatStore = create<ConversationChatState>((set) => ({
    isThreadOpen: false,
    openThread: () => set({ isThreadOpen: true }),
    closeThread: () => set({ isThreadOpen: false }),
}))
