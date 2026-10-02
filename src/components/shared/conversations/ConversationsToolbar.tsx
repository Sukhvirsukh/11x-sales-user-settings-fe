import Heading from "@/components/design/Heading"
import SearchField from "@/components/shared/SearchField"
import { cn } from "@/lib/utils"
import { useConversationChatStore } from "@/features/conversations/conversationChatStore"
import { useConversationFilterStore } from "@/features/conversations/conversationFilterStore"
import { ConversationsFilterModal } from "./ConversationsFilterModal"

/**
 * Mobile toolbar above the conversations grid: the list title on the left, chat
 * search and the filter modal trigger on the right. From `lg` up the filter sits
 * inline beside the panel, so the whole row is hidden rather than rearranged.
 */
export function ConversationsToolbar() {
    const setSearchQuery = useConversationFilterStore((state) => state.setSearchQuery)
    const isThreadOpen = useConversationChatStore((state) => state.isThreadOpen)

    return (
        <div
            /* An open thread overlaps this row rather than replacing it, so it stays
               rendered and is only taken out of the a11y tree while covered. */
            inert={isThreadOpen}
            aria-hidden={isThreadOpen}
            className={cn(
                "relative flex w-full items-center justify-between gap-2 lg:hidden",
                // Shares the panel's grid cell so the thread can paint over the row.
                isThreadOpen && "max-lg:col-start-1 max-lg:row-start-1",
            )}
        >
            <Heading size="md" className="font-semibold">All Chats</Heading>
            <div className="flex shrink-0 items-center gap-1">
                <SearchField
                    label="Search chats"
                    onSearchChange={setSearchQuery}
                    viewport="lg"
                    showFilterModal={false}
                />
                <ConversationsFilterModal />
            </div>
        </div>
    )
}
