import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/design/DateRangePicker"
import Label from "@/components/design/Label"

interface DateRangeFilterRowProps {
    label: string
    value: DateRange | undefined
    onChange: (value: DateRange | undefined) => void
}

/**
 * One date-range filter inside a filter modal: the heading with its selected bounds on the
 * right, above a fixed-width picker. The picker renders its own label nowhere, so keep the
 * heading here.
 */
export default function DateRangeFilterRow({ label, value, onChange }: DateRangeFilterRowProps) {
    const hasValue = Boolean(value?.from || value?.to)

    return (
        <div>
            <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">{label}</Label>
                {hasValue && (
                    <p className="text-xs text-content-muted">selected {value?.from ? `from ${format(value.from, "yyyy-MM-dd")}` : ""} {value?.to ? `to ${format(value.to, "yyyy-MM-dd")}` : ""}</p>
                )}
            </div>
            <div className="w-52">
                <DateRangePicker
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}
