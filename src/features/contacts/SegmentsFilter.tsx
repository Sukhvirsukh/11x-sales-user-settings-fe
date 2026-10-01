import { Toggle } from "@/components/ui/toggle"
import type { SegmentStatus, SegmentStatusFilter } from "./contactType"

const statuses: { value: SegmentStatusFilter; label: SegmentStatus }[] = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
]

interface SegmentsFilterProps {
    value: SegmentStatusFilter | null
    onChange: (status: SegmentStatusFilter | null) => void
}

export default function SegmentsFilter({ value, onChange }: SegmentsFilterProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-content-strong">Status</p>
                <span className="text-xs text-content-muted">{value ? "1 selected" : "0 selected"}</span>
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
                {statuses.map((status) => (
                    <Toggle
                        key={status.value}
                        type="button"
                        variant="outline"
                        size="xs"
                        pressed={value === status.value}
                        onPressedChange={(pressed) => onChange(pressed ? status.value : null)}
                        className="rounded-full border-section-border text-content-muted shadow-none hover:border-primary aria-pressed:border-primary aria-pressed:bg-section-background aria-pressed:text-content-strong"
                    >
                        {status.label}
                    </Toggle>
                ))}
            </div>
        </div>
    )
}
