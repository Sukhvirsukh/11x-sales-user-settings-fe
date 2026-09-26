import { Checkbox } from "@/components/ui/checkbox"
import Heading from "@/components/design/Heading"
import { RatingStars } from "@/components/shared/RatingStars"
import SearchField from "@/components/shared/SearchField"
import { Separator } from "@/components/ui/separator"
import { useConversationFilterStore } from "@/features/conversations/conversationFilterStore"
import { filterGroups, type FilterOption } from "./conversationData"
import AppSection from "@/components/design/AppSectoin"

const emptySelection: string[] = []

function FilterGroup({ title, options }: { title: string; options: FilterOption[] }) {
    const selected = useConversationFilterStore((state) => state.selectedFilters[title] ?? emptySelection)
    const toggleFilter = useConversationFilterStore((state) => state.toggleFilter)

    return (
        <section className="flex w-full flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
                <Heading size="md">{title}</Heading>
                <span className="text-xs text-content-muted">{selected.length} selected</span>
            </div>
            <Separator className="bg-section-border" />
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
                        {option.stars ? <RatingStars count={option.stars} /> : null}
                    </label>
                ))}
            </div>
        </section>
    )
}

export function ConversationsFilter() {
    const setSearchQuery = useConversationFilterStore((state) => state.setSearchQuery)

    return (
        <AppSection>
            <SearchField onSearchChange={setSearchQuery} showMobilePanel={false} fullWidth />
            <div className="flex w-full flex-col gap-4">
                {filterGroups.map((group) => <FilterGroup key={group.title} {...group} />)}
            </div>
        </AppSection>
    )
}
