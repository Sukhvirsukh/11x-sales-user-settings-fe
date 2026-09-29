import { ListFilter } from "lucide-react"
import Modal from "@/components/design/Modal"
import { Button } from "@/components/ui/button"
import { ConversationsFilter } from "./ConversationsFilter"

export function ConversationsFilterModal() {
    return (
        <Modal
            title="Filters"
            trigger={
                <Button variant="ghost" size="sm" className="bg-white px-1.5" aria-label="Filters">
                    <ListFilter className="size-4" />
                </Button>
            }
        >
            <ConversationsFilter className="border-0 bg-transparent p-0" />
        </Modal>
    )
}
