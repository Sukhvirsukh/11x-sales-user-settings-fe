import { format, parseISO } from "date-fns"
import type { DateRange } from "react-day-picker"
import { useRef, useState } from "react"
import DateRangeFilterRow from "@/components/shared/DateRangeFilterRow"
import FilterModal from "@/components/shared/FilterModal"
import SearchField from "@/components/shared/SearchField"
import SingleSelectFilter from "@/components/shared/SingleSelectFilter"
import { useDebounce } from "@/hooks/useDebounce"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { parseStoreFilters, type StoreStatusFilter } from "./storeFilters"

const statuses: { value: StoreStatusFilter; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
]

/** Turns a draft range into the `yyyy-MM-dd` URL/API pair the parser reads back. */
function toDateParams(value: DateRange | undefined) {
    return {
        createdAtFrom: value?.from ? format(value.from, "yyyy-MM-dd") : null,
        createdAtTo: value?.to ? format(value.to, "yyyy-MM-dd") : null,
    }
}

export default function StoreFilter() {
    const {
        filters: { status, createdAtFrom, createdAtTo },
        setFilters,
    } = useUrlFilters(parseStoreFilters)
    const [isOpen, setIsOpen] = useState(false)
    const [draftStatus, setDraftStatus] = useState<StoreStatusFilter | null>(status)
    const appliedRange = createdAtFrom || createdAtTo ? {
        from: createdAtFrom ? parseISO(createdAtFrom) : undefined,
        to: createdAtTo ? parseISO(createdAtTo) : undefined,
    } : undefined
    const [draftRange, setDraftRange] = useState<DateRange | undefined>(appliedRange)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const handleSearchChange = useDebounce((search: string) => setFilters({ search }))

    const appliedCount = Number(Boolean(status)) + Number(Boolean(createdAtFrom || createdAtTo))
    const draftCount = Number(Boolean(draftStatus)) + Number(Boolean(draftRange?.from || draftRange?.to))

    /** Discard edits, so Cancel and dismissal leave the applied filters alone. */
    function resetDrafts() {
        setDraftStatus(status)
        setDraftRange(appliedRange)
    }

    return (
        <>
            <SearchField
                label="Search stores"
                onSearchChange={handleSearchChange}
                filterCount={appliedCount}
                onFilterClick={(event) => {
                    triggerRef.current = event.currentTarget
                    resetDrafts()
                    setIsOpen(true)
                }}
            />
            <FilterModal
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open)
                    if (!open) resetDrafts()
                }}
                finalFocus={triggerRef}
                selectedCount={draftCount}
                onClearAll={() => {
                    setDraftStatus(null)
                    setDraftRange(undefined)
                }}
                onSubmit={() => setFilters({
                    status: draftStatus,
                    ...toDateParams(draftRange),
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
            </FilterModal>
        </>
    )
}
