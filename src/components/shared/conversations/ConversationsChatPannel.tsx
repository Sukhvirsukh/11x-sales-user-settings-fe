import { useEffect, useRef, useState } from "react"
import AppSection from "@/components/design/AppSectoin"
import { cn } from "@/lib/utils"
import { useViewpoint } from "@/hooks/useViewpoint"
import { useConversationChatStore } from "@/features/conversations/conversationChatStore"
import { conversationMessages, conversations } from "./conversationData"
import { ConversationList } from "./ConversationList"
import { CustomerDetails } from "./CustomerDetails"
import { MessageHistory } from "./MessageHistory"
import ShareUrlField from "./ShareUrlField"

interface ConversationsChatPannelProps {
    alwaysShowChatInput?: boolean
}

export function ConversationsChatPannel({ alwaysShowChatInput = false }: ConversationsChatPannelProps) {
    const [selectedId, setSelectedId] = useState(conversations[0].id)
    const [messages, setMessages] = useState(conversationMessages)
    // Keep unsent work above the responsive branches, separately for each chat.
    const [drafts, setDrafts] = useState<Record<number, string>>({})
    const [takeovers, setTakeovers] = useState<Record<number, boolean>>({})
    const selectedButtonRef = useRef<HTMLButtonElement>(null)
    const threadHeadingRef = useRef<HTMLParagraphElement>(null)
    const pendingFocus = useRef<"thread" | "list" | null>(null)
    // `lg` is where the list, thread and customer details sit side by side; below it only one
    // panel fits at a time, so the thread overlaps the list instead of sitting beside it.
    const isBelowLg = !useViewpoint("lg")

    // The takeover is shared with the toolbar, which steps aside while it is open.
    const isThreadOpen = useConversationChatStore((state) => state.isThreadOpen)
    const openThread = useConversationChatStore((state) => state.openThread)
    const closeThread = useConversationChatStore((state) => state.closeThread)

    useEffect(() => {
        // Switching conversations tabs remounts the panel, which should return to the list.
        return () => closeThread()
    }, [closeThread])

    useEffect(() => {
        if (pendingFocus.current === "thread") threadHeadingRef.current?.focus()
        if (pendingFocus.current === "list") selectedButtonRef.current?.focus()
        pendingFocus.current = null
    }, [isThreadOpen, isBelowLg, selectedId])

    const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0]

    function handleSelect(id: number) {
        if (isBelowLg) pendingFocus.current = "thread"
        setSelectedId(id)
        openThread()
    }

    function handleBack() {
        pendingFocus.current = "list"
        closeThread()
    }

    function handleCorrect(id: string, content: string) {
        setMessages((current) => current.map((message) => message.id === id ? { ...message, content } : message))
    }

    function handleSend(content: string) {
        setMessages((current) => [
            ...current,
            { id: crypto.randomUUID(), content, sender: "user" },
        ])
    }

    const list = <ConversationList selectedId={selectedId} onSelect={handleSelect} selectedButtonRef={selectedButtonRef} />
    const thread = (
        <MessageHistory
            messages={messages}
            onCorrect={handleCorrect}
            onSend={handleSend}
            alwaysShowChatInput={alwaysShowChatInput}
            onBack={handleBack}
            draft={drafts[selectedId] ?? ""}
            onDraftChange={(value) => setDrafts((current) => ({ ...current, [selectedId]: value }))}
            isTakeoverActive={takeovers[selectedId] ?? false}
            onTakeover={() => setTakeovers((current) => ({ ...current, [selectedId]: true }))}
            headingRef={threadHeadingRef}
        />
    )
    const customerDetails = <CustomerDetails conversation={selectedConversation} />

    /*
     * The panel owns the section surface, because it is the only thing whose shape changes: from
     * `lg` up the three panels share one `AppSection`, while below `lg` the list and the thread
     * become separate blocks that `ConversationsPage` drops straight into its own grid, so the
     * thread can leave the card and fill the section.
     */
    if (isBelowLg) {
        return (
            <>
                {/*
                 * `invisible` rather than `hidden` on purpose: the list keeps occupying its
                 * space (nothing reflows, and the section keeps its height) but stops painting,
                 * so nothing shows through the thread while it covers the list.
                 */}
                <div
                    className={cn("w-full min-w-0", isThreadOpen && "col-start-1 row-start-1 invisible")}
                    inert={isThreadOpen}
                    aria-hidden={isThreadOpen}
                >
                    <AppSection>
                        <div className="w-full">
                            {list}
                        </div>
                    </AppSection>
                </div>
                {isThreadOpen && (
                    /*
                     * The thread takes the whole section over: it shares the toolbar's grid cell
                     * so it paints across that row rather than replacing it, and carries the
                     * section's own background, since it is the section's surface from here on.
                     * Customer details remain separate from the message surface below the thread.
                     */
                    <div className="col-start-1 row-start-1 z-10 flex w-full min-w-0 animate-in flex-col gap-3.5 bg-preview-section-background duration-300 ease-out slide-in-from-left motion-reduce:animate-none">
                        {thread}
                        <AppSection>
                            <div className="w-full">
                                {customerDetails}
                            </div>
                        </AppSection>
                        <ShareUrlField url={selectedConversation.shareUrl} />
                    </div>
                )}
            </>
        )
    }

    return (
        <AppSection className="min-h-0 min-w-0">
            <div className="grid h-full w-full min-w-0 grid-cols-[minmax(180px,1fr)_minmax(0,3fr)_minmax(176px,1fr)] gap-3.5">
                {list}
                {thread}
                {customerDetails}
            </div>
        </AppSection>
    )
}
