import { format, parseISO } from "date-fns"
import type { DateRange } from "react-day-picker"
import { useRef, useState } from "react"
import DateRangeFilterRow from "@/components/shared/DateRangeFilterRow"
import FilterPopover from "@/components/shared/FilterPopover"
import SearchField from "@/components/shared/SearchField"
import SingleSelectFilter from "@/components/shared/SingleSelectFilter"
import { useDebounce } from "@/hooks/useDebounce"
import type { SegmentStatus, SegmentStatusFilter } from "./contactType"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { parseSegmentFilters } from "./segmentFilters"

const statuses: { value: SegmentStatusFilter; label: SegmentStatus }[] = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
]

export default function SegmentsFilter() {
    const { filters: { status, createdAtFrom, createdAtTo }, setFilters } = useUrlFilters(parseSegmentFilters)
    const [isOpen, setIsOpen] = useState(false)
    const [draftStatus, setDraftStatus] = useState(status)
    const appliedRange = createdAtFrom || createdAtTo ? {
        from: createdAtFrom ? parseISO(createdAtFrom) : undefined,
        to: createdAtTo ? parseISO(createdAtTo) : undefined,
    } : undefined
    const [draftRange, setDraftRange] = useState<DateRange | undefined>(appliedRange)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const handleSearchChange = useDebounce((search: string) => setFilters({ search }))

    return (
        <>
            <SearchField
                label="Search segments"
                onSearchChange={handleSearchChange}
                filterCount={Number(Boolean(status)) + Number(Boolean(createdAtFrom || createdAtTo))}
                onFilterClick={(event) => {
                    triggerRef.current = event.currentTarget
                    setDraftStatus(status)
                    setDraftRange(appliedRange)
                    setIsOpen(true)
                }}
            />
            <FilterPopover
                open={isOpen}
                anchor={triggerRef}
                onOpenChange={(open) => {
                    setIsOpen(open)
                    if (!open) {
                        setDraftStatus(status)
                        setDraftRange(appliedRange)
                    }
                }}
                finalFocus={triggerRef}
                selectedCount={Number(Boolean(draftStatus)) + Number(Boolean(draftRange?.from || draftRange?.to))}
                onClearAll={() => {
                    setDraftStatus(null)
                    setDraftRange(undefined)
                    setFilters({ status: null, createdAtFrom: null, createdAtTo: null })
                }}
                onSubmit={() => setFilters({
                    status: draftStatus,
                    createdAtFrom: draftRange?.from ? format(draftRange.from, "yyyy-MM-dd") : null,
                    createdAtTo: draftRange?.to ? format(draftRange.to, "yyyy-MM-dd") : null,
                })}
            >
                <div className="space-y-4">
                    <SingleSelectFilter label="Status" options={statuses} value={draftStatus} onChange={setDraftStatus} />
                    <DateRangeFilterRow
                        label="Created date"
                        value={draftRange}
                        onChange={setDraftRange}
                    />
                </div>
            </FilterPopover>
        </>
    )
}
