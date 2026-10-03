import { format, parseISO } from "date-fns"
import type { DateRange } from "react-day-picker"
import { useRef, useState } from "react"

import DateRangeFilterRow from "@/components/shared/DateRangeFilterRow"
import FilterModal from "@/components/shared/FilterModal"
import SearchField from "@/components/shared/SearchField"
import MultiSelectFilter from "@/components/shared/MultiSelectFilter"
import SingleSelectFilter from "@/components/shared/SingleSelectFilter"
import { useDebounce } from "@/hooks/useDebounce"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { knowledgeBaseFormatFilters, parseKnowledgeBaseFilters } from "./knowledgeBaseFilters"
import type { KnowledgeBaseStatus } from "./knowledgeBaseTypes"

const statuses: { value: KnowledgeBaseStatus; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
]

const formats = knowledgeBaseFormatFilters.map((value) => ({ value, label: value }))

/** Turns a draft range into the `yyyy-MM-dd` URL/API pair the parser reads back. */
function toDateParams(value: DateRange | undefined, base: "createdAt" | "lastUpdated") {
    return {
        [`${base}From`]: value?.from ? format(value.from, "yyyy-MM-dd") : null,
        [`${base}To`]: value?.to ? format(value.to, "yyyy-MM-dd") : null,
    }
}

function toDraftRange(from: string | null, to: string | null): DateRange | undefined {
    return from || to ? {
        from: from ? parseISO(from) : undefined,
        to: to ? parseISO(to) : undefined,
    } : undefined
}

export default function KnowledgeBaseFilter() {
    const {
        filters: { status, format, createdAtFrom, createdAtTo, lastUpdatedFrom, lastUpdatedTo },
        setFilters,
    } = useUrlFilters(parseKnowledgeBaseFilters)
    const [isOpen, setIsOpen] = useState(false)
    const [draftStatus, setDraftStatus] = useState(status)
    const [draftFormat, setDraftFormat] = useState(format)
    const appliedCreatedRange = toDraftRange(createdAtFrom, createdAtTo)
    const appliedLastUpdatedRange = toDraftRange(lastUpdatedFrom, lastUpdatedTo)
    const [draftCreatedRange, setDraftCreatedRange] = useState<DateRange | undefined>(appliedCreatedRange)
    const [draftLastUpdatedRange, setDraftLastUpdatedRange] = useState<DateRange | undefined>(appliedLastUpdatedRange)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const handleSearchChange = useDebounce((search: string) => setFilters({ search }))

    const appliedCount = Number(Boolean(status))
        + Number(format.length > 0)
        + Number(Boolean(createdAtFrom || createdAtTo))
        + Number(Boolean(lastUpdatedFrom || lastUpdatedTo))
    const draftCount = Number(Boolean(draftStatus))
        + Number(draftFormat.length > 0)
        + Number(Boolean(draftCreatedRange?.from || draftCreatedRange?.to))
        + Number(Boolean(draftLastUpdatedRange?.from || draftLastUpdatedRange?.to))

    /** Discard edits, so Cancel and dismissal leave the applied filters alone. */
    function resetDrafts() {
        setDraftStatus(status)
        setDraftFormat(format)
        setDraftCreatedRange(appliedCreatedRange)
        setDraftLastUpdatedRange(appliedLastUpdatedRange)
    }

    return (
        <>
            <SearchField
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
                    setDraftFormat([])
                    setDraftCreatedRange(undefined)
                    setDraftLastUpdatedRange(undefined)
                    setFilters({
                        status: null,
                        format: [],
                        ...toDateParams(undefined, "createdAt"),
                        ...toDateParams(undefined, "lastUpdated"),
                    })
                }}
                onSubmit={() => setFilters({
                    status: draftStatus,
                    format: draftFormat,
                    ...toDateParams(draftCreatedRange, "createdAt"),
                    ...toDateParams(draftLastUpdatedRange, "lastUpdated"),
                })}
            >
                <div className="space-y-4">
                    <SingleSelectFilter label="Status" options={statuses} value={draftStatus} onChange={setDraftStatus} />
                    <MultiSelectFilter label="Format" options={formats} value={draftFormat} onChange={setDraftFormat} />
                    <DateRangeFilterRow
                        label="Created date"
                        value={draftCreatedRange}
                        onChange={setDraftCreatedRange}
                    />
                    <DateRangeFilterRow
                        label="Last refresh"
                        value={draftLastUpdatedRange}
                        onChange={setDraftLastUpdatedRange}
                    />
                </div>
            </FilterModal>
        </>
    )
}
