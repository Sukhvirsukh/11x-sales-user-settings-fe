import { Search } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import AppCard from "@/components/design/AppCard"
import { useConversationFilterStore } from "@/features/conversations/conversationFilterStore"
import { filterGroups } from "./conversationData"

const emptySelection: string[] = []

function FilterGroup({ title, options }: { title: string; options: string[] }) {
    const selected = useConversationFilterStore((state) => state.selectedFilters[title] ?? emptySelection)
    const toggleFilter = useConversationFilterStore((state) => state.toggleFilter)

    return (
        <div className="rounded-lg bg-light p-3">
            <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
                <p className="text-sm font-medium text-foreground">{title}</p>
                {selected.length > 0 && <span className="text-xs text-muted-foreground">{selected.length} selected</span>}
            </div>
            <div className="space-y-2.5">
                {options.map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                        <Checkbox
                            checked={selected.includes(option)}
                            onCheckedChange={(checked) => toggleFilter(title, option, checked)}
                        />
                        {option}
                    </label>
                ))}
            </div>
        </div>
    )
}

export function ConversationsFilter() {
    const searchQuery = useConversationFilterStore((state) => state.searchQuery)
    const setSearchQuery = useConversationFilterStore((state) => state.setSearchQuery)

    return (
        <AppCard header="Filters" shadow>
            <div className="relative mb-3 h-9">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    aria-label="Search conversations"
                    placeholder="Search conversations"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="rounded-lg border border-input bg-card-nested pl-9"
                />
            </div>
            <div className="space-y-3">
                {filterGroups.map((group) => <FilterGroup key={group.title} {...group} />)}
            </div>
        </AppCard>
    )
}
