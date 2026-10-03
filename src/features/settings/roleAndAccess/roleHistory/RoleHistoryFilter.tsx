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
import { ROLE_OPTIONS } from "./roleOptions"
import { parseRoleHistoryFilters, type RoleFilter, type RoleStatusFilter } from "./roleHistoryFilters"

const roles = ROLE_OPTIONS.map(({ value, label }) => ({ value: value as RoleFilter, label }))

const statuses: { value: RoleStatusFilter; label: string }[] = [
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

export default function RoleHistoryFilter() {
    const {
        filters: { role, status, createdAtFrom, createdAtTo },
        setFilters,
    } = useUrlFilters(parseRoleHistoryFilters)
    const [isOpen, setIsOpen] = useState(false)
    const [draftRole, setDraftRole] = useState<RoleFilter[]>(role)
    const [draftStatus, setDraftStatus] = useState<RoleStatusFilter | null>(status)
    const appliedRange = createdAtFrom || createdAtTo ? {
        from: createdAtFrom ? parseISO(createdAtFrom) : undefined,
        to: createdAtTo ? parseISO(createdAtTo) : undefined,
    } : undefined
    const [draftRange, setDraftRange] = useState<DateRange | undefined>(appliedRange)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const handleSearchChange = useDebounce((search: string) => setFilters({ search }))

    const appliedCount = Number(role.length > 0)
        + Number(Boolean(status))
        + Number(Boolean(createdAtFrom || createdAtTo))
    const draftCount = Number(draftRole.length > 0)
        + Number(Boolean(draftStatus))
        + Number(Boolean(draftRange?.from || draftRange?.to))

    /** Discard edits, so Cancel and dismissal leave the applied filters alone. */
    function resetDrafts() {
        setDraftRole(role)
        setDraftStatus(status)
        setDraftRange(appliedRange)
    }

    return (
        <>
            <SearchField
                label="Search roles"
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
                    setDraftRole([])
                    setDraftStatus(null)
                    setDraftRange(undefined)
                    setFilters({ role: [], status: null, ...toDateParams(undefined) })
                }}
                onSubmit={() => setFilters({
                    role: draftRole,
                    status: draftStatus,
                    ...toDateParams(draftRange),
                })}
            >
                <div className="space-y-4">
                    <MultiSelectFilter
                        label="Role"
                        options={roles}
                        value={draftRole}
                        onChange={setDraftRole}
                    />
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
