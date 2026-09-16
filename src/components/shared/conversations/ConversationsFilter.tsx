import { Star } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import AppCard from "@/components/design/AppCard"
import SearchField from "@/components/shared/SearchField"
import { useConversationFilterStore } from "@/features/conversations/conversationFilterStore"
import { filterGroups, type FilterOption } from "./conversationData"

const emptySelection: string[] = []

function Stars({ count }: { count: number }) {
    return (
        <span className="flex shrink-0 items-center gap-0.5">
            {Array.from({ length: count }, (_, index) => (
                <Star key={index} className="size-3.5 text-gray" />
            ))}
        </span>
    )
}

function FilterGroup({ title, options }: { title: string; options: FilterOption[] }) {
    const selected = useConversationFilterStore((state) => state.selectedFilters[title] ?? emptySelection)
    const toggleFilter = useConversationFilterStore((state) => state.toggleFilter)

    return (
        <div className="w-full border-t border-section-border pt-3">
            <div className="mb-2.5 flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{title}</p>
                {selected.length > 0 && <span className="text-xs text-ghost">{selected.length} selected</span>}
            </div>
            <div className="flex flex-col gap-2.5">
                {options.map((option) => (
                    <label key={option.label} className="flex cursor-pointer items-center justify-between gap-2 text-sm text-foreground">
                        <span className="flex items-center gap-2">
                            <Checkbox
                                checked={selected.includes(option.label)}
                                onCheckedChange={(checked) => toggleFilter(title, option.label, checked)}
                            />
                            {option.label}
                        </span>
                        {option.stars ? <Stars count={option.stars} /> : null}
                    </label>
                ))}
            </div>
        </div>
    )
}

export function ConversationsFilter() {
    const setSearchQuery = useConversationFilterStore((state) => state.setSearchQuery)

    return (
        <AppCard header="Filters" shadow className="h-fit">
            <SearchField onSearchChange={setSearchQuery} />
            <div className="mt-3 flex flex-col gap-3">
                {filterGroups.map((group) => <FilterGroup key={group.title} {...group} />)}
            </div>
        </AppCard>
    )
}
