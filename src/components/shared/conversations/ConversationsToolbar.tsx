import Heading from "@/components/design/Heading"
import Modal from "@/components/design/Modal"
import SearchField from "@/components/shared/SearchField"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useConversationChatStore } from "@/features/conversations/conversationChatStore"
import { useConversationFilterStore } from "@/features/conversations/conversationFilterStore"
import { ListFilter } from "lucide-react"
import { ConversationsFilter } from "./ConversationsFilter"

/**
 * Mobile toolbar above the conversations grid: the list title on the left, chat
 * search and the filter modal trigger on the right. From `lg` up the filter sits
 * inline beside the panel, so the whole row is hidden rather than rearranged.
 */
export function ConversationsToolbar() {
    const setSearchQuery = useConversationFilterStore((state) => state.setSearchQuery)
    // An open thread takes over the panel, so this row gets out of its way.
    const isThreadOpen = useConversationChatStore((state) => state.isThreadOpen)

    return (
        <div className={cn(
            "flex w-full items-center justify-between gap-2 lg:hidden",
            isThreadOpen && "max-lg:hidden",
        )}>
            <Heading size="md" className="font-semibold">All Chats</Heading>
            <div className="flex shrink-0 items-center gap-1">
                <SearchField
                    label="Search chats"
                    onSearchChange={setSearchQuery}
                    viewport="lg"
                />
                <Modal
                    title="Filters"
                    trigger={
                        /* Mirrors the SearchField trigger so the two icons line up. */
                        <Button variant="ghost" size="sm" className="bg-white px-1.5" aria-label="Filters">
                            <ListFilter className="size-4" />
                        </Button>
                    }
                >
                    <ConversationsFilter className="border-0 bg-transparent p-0" />
                </Modal>
            </div>
        </div>
    )
}
