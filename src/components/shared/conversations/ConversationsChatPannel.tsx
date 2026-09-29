import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useViewpoint } from "@/hooks/useViewpoint"
import { useConversationChatStore } from "@/features/conversations/conversationChatStore"
import { conversationMessages, conversations } from "./conversationData"
import { ConversationList } from "./ConversationList"
import { CustomerDetails } from "./CustomerDetails"
import { MessageHistory } from "./MessageHistory"

interface ConversationsChatPannelProps {
    alwaysShowChatInput?: boolean
}

export function ConversationsChatPannel({ alwaysShowChatInput = false }: ConversationsChatPannelProps) {
    const [selectedId, setSelectedId] = useState(conversations[0].id)
    const [messages, setMessages] = useState(conversationMessages)
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

    const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0]
    const showThread = !isBelowLg || isThreadOpen
    // While the thread covers the list on mobile, the list keeps its box but stops painting.
    const isListCovered = isBelowLg && isThreadOpen

    function handleSelect(id: number) {
        setSelectedId(id)
        openThread()
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

    return (
        <div className="grid w-full h-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(180px,1fr)_minmax(0,3fr)_minmax(176px,1fr)] lg:gap-3.5">
            {/*
             * `invisible` rather than `hidden` on purpose: the list keeps occupying its
             * space (nothing reflows, and the section keeps its height) but stops painting,
             * so nothing shows through the thread's transparent areas — and no opaque
             * surface is needed on the thread, which would tint `CustomerDetails`.
             */}
            <div
                className={cn("min-w-0", isListCovered && "max-lg:col-start-1 max-lg:row-start-1 max-lg:invisible")}
                inert={isListCovered}
                aria-hidden={isListCovered}
            >
                <ConversationList selectedId={selectedId} onSelect={handleSelect} />
            </div>
            {showThread && (
                /*
                 * Below `lg` the thread slides in from the left and overlaps the whole panel:
                 * it shares the list's grid cell, so the row grows to fit it, and it paints
                 * over the list (which is kept invisible while covered) as well as over the
                 * toolbar row the panel already covers. From `lg` up the wrapper leaves the
                 * layout entirely (`contents`), so the thread and the customer details
                 * become direct grid items again. It deliberately paints no surface of its
                 * own, so `CustomerDetails` keeps the panel's background.
                 */
                <div className="flex min-w-0 flex-col gap-4 max-lg:z-10 max-lg:col-start-1 max-lg:row-start-1 max-lg:animate-in max-lg:slide-in-from-left max-lg:duration-300 max-lg:ease-out motion-reduce:animate-none lg:contents">
                    <MessageHistory
                        messages={messages}
                        onCorrect={handleCorrect}
                        onSend={handleSend}
                        alwaysShowChatInput={alwaysShowChatInput}
                        onBack={closeThread}
                    />
                    <CustomerDetails conversation={selectedConversation} />
                </div>
            )}
        </div>
    )
}
