import { useId } from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Label from "./Label"

interface DateRangePickerProps {
    label?: string
    value: DateRange | undefined
    onChange: (value: DateRange | undefined) => void
    disabled?: boolean
    /** Custom class names for the label (typography, spacing) */
    labelClassName?: string
}

export function DateRangePicker({ label, value, onChange, disabled = false, labelClassName }: DateRangePickerProps) {
    const id = useId()
    const selectionLabel = value?.from
        ? `${format(value.from, "d MMM yyyy")} – ${value.to ? format(value.to, "d MMM yyyy") : "Select end date"}`
        : value?.to ? `Until ${format(value.to, "d MMM yyyy")}` : "Pick a date range"

    return (
        <div className="flex w-full flex-col gap-2">
            <Label htmlFor={id} className={labelClassName}>{label}</Label>
            <Popover>
                <PopoverTrigger render={
                    <Button
                        id={id}
                        type="button"
                        variant="bare"
                        disabled={disabled}
                        data-empty={!value?.from && !value?.to}
                        className="h-[34px] w-full justify-between rounded-xl border border-section-border bg-field-subtle-background px-3.5 text-left text-sm font-normal text-field-text transition-all hover:bg-field-subtle-background focus-visible:ring-2 focus-visible:ring-focus-ring/20 data-[empty=true]:text-placeholder disabled:cursor-not-allowed md:px-3.5 md:text-sm"
                    >
                        {selectionLabel}
                        <CalendarIcon className="size-4 shrink-0 text-content-muted" aria-hidden="true" />
                    </Button>
                } />
                {/* Locked above the trigger and centered on it, matching DatePicker. `shift`
                    keeps the requested side instead of letting the popup flip below the field;
                    it only slides back into view when it would leave the viewport. */}
                <PopoverContent
                    className="w-auto overflow-hidden rounded-xl border border-section-border bg-surface-raised p-0 font-sans text-sm text-foreground shadow-panel ring-0"
                    side="top"
                    align="center"
                    sideOffset={8}
                    collisionPadding={8}
                    collisionAvoidance={{ side: "shift", align: "shift" }}
                >
                    <Calendar
                        /* Constant row count keeps the popup height stable across
                           months, so it never re-flips position while navigating. */
                        fixedWeeks
                        className="p-3 [--cell-radius:10px] [--cell-size:2rem] [&_button[data-day]]:p-0 [&_button[data-day]]:text-sm [&_button[data-day]]:text-inherit [&_button[data-day]:hover]:bg-interactive-active-background [&_button[data-range-start=true][data-day]]:text-primary-contrast [&_button[data-range-start=true][data-day]:hover]:bg-primary-hover [&_button[data-range-middle=true]]:bg-interactive-active-background [&_button[data-range-end=true][data-day]]:text-primary-contrast [&_button[data-range-end=true][data-day]:hover]:bg-primary-hover"
                        classNames={{
                            month_caption: "flex h-(--cell-size) w-full items-center justify-center rounded-lg bg-field-subtle-background px-(--cell-size)",
                            caption_label: "text-sm font-medium select-none",
                            button_previous: "inline-flex size-(--cell-size) items-center justify-center rounded-lg text-content-muted transition-colors hover:bg-interactive-active-background hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/20 aria-disabled:opacity-50",
                            button_next: "inline-flex size-(--cell-size) items-center justify-center rounded-lg text-content-muted transition-colors hover:bg-interactive-active-background hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/20 aria-disabled:opacity-50",
                            weekday: "flex-1 text-sm font-normal text-content-muted select-none",
                            today: "rounded-[10px] bg-interactive-active-background text-primary",
                            outside: "text-content-muted opacity-50",
                            disabled: "text-content-muted opacity-40",
                            range_start: "relative isolate z-0 rounded-l-(--cell-radius) bg-interactive-active-background after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-interactive-active-background",
                            range_middle: "rounded-none",
                            range_end: "relative isolate z-0 rounded-r-(--cell-radius) bg-interactive-active-background after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-interactive-active-background",
                        }}
                        mode="range"
                        selected={value}
                        defaultMonth={value?.from}
                        onSelect={onChange}
                    />
                    <div className="flex items-center justify-between gap-3 border-t border-section-border px-3 py-2">
                        <span className="text-sm text-content-muted">
                            {value?.from && !value.to ? "Choose an end date." : "Choose a start and end date."}
                        </span>
                        <Button
                            type="button"
                            variant="underline-bare"
                            size="sm"
                            disabled={!value?.from && !value?.to}
                            onClick={() => onChange(undefined)}
                        >
                            Clear dates
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
