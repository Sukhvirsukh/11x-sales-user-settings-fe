import { format, parseISO } from "date-fns"
import type { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/design/DateRangePicker"
import { useRef, useState } from "react"
import FilterModal from "@/components/shared/FilterModal"
import SearchField from "@/components/shared/SearchField"
import SingleSelectFilter from "@/components/shared/SingleSelectFilter"
import { useDebounce } from "@/hooks/useDebounce"
import type { SegmentStatus, SegmentStatusFilter } from "./contactType"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { parseSegmentFilters } from "./segmentFilters"
import Label from "@/components/design/Label"

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
            <FilterModal
                open={isOpen}
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
                }}
                onSubmit={() => setFilters({
                    status: draftStatus,
                    createdAtFrom: draftRange?.from ? format(draftRange.from, "yyyy-MM-dd") : null,
                    createdAtTo: draftRange?.to ? format(draftRange.to, "yyyy-MM-dd") : null,
                })}
            >
                <div className="space-y-4">
                    <SingleSelectFilter label="Status" options={statuses} value={draftStatus} onChange={setDraftStatus} />
                    <div>
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium">Created date</Label>
                            <p className="text-xs text-content-muted">selected {draftRange?.from ? `from ${format(draftRange.from, "yyyy-MM-dd")}` : ""} {draftRange?.to ? `to ${format(draftRange.to, "yyyy-MM-dd")}` : ""}</p>
                        </div>
                        <div className="w-52">
                            <DateRangePicker
                                value={draftRange}
                                onChange={setDraftRange}
                                labelClassName="text-sm"
                            />
                        </div>
                    </div>
                    <p className="text-sm text-content-muted">Select a range, or a start date to include everything from that day onward.</p>
                </div>
            </FilterModal>
        </>
    )
}
