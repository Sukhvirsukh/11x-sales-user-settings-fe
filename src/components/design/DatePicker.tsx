import * as React from "react"
import { format as formatDate } from "date-fns"
import { Calendar as CalendarIcon, Info } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { FieldError } from "@/components/ui/field"
import Label from "./Label"
import HelperText from "./HelperText"

export interface DatePickerProps {
    /** Label displayed above the date picker */
    label?: string
    /** Hint text displayed below the date picker */
    hint?: string
    /** Error message displayed below the date picker */
    error?: string
    /** Placeholder text when no date is selected */
    placeholder?: string
    /** date-fns format string used to display the selected date */
    dateFormat?: string
    /** Controlled selected date */
    value?: Date
    /** Default selected date (uncontrolled mode) */
    defaultValue?: Date
    /** Callback when the selected date changes */
    onChange?: (date: Date | undefined) => void
    /** Unique ID for the trigger button */
    id?: string
    /** Disable the entire date picker */
    disabled?: boolean
    /** Custom class names for the trigger button */
    className?: string
    /** Custom class names for the container */
    containerClassName?: string
    /** Custom class names for the label */
    labelClassName?: string
    /** Visual variant of the date picker */
    variant?: "default" | "light"
    /** Ref to the trigger button (React 19: plain prop, no forwardRef) */
    ref?: React.Ref<HTMLButtonElement>
}

function DatePicker({
    label,
    hint,
    error,
    placeholder = "Pick a date",
    dateFormat = "PPP",
    value,
    defaultValue,
    onChange,
    id,
    disabled = false,
    className,
    containerClassName,
    labelClassName,
    variant = "light",
    ref,
}: DatePickerProps) {
    const generatedId = React.useId()
    const datePickerId = id || generatedId
    const hintId = `${datePickerId}-hint`
    const errorId = `${datePickerId}-error`

    // Support both controlled (`value`) and uncontrolled (`defaultValue`) usage
    const [internalDate, setInternalDate] = React.useState<Date | undefined>(defaultValue)
    const isControlled = value !== undefined
    const selectedDate = isControlled ? value : internalDate
    const handleSelect = (date: Date | undefined) => {
        if (!isControlled) setInternalDate(date)
        onChange?.(date)
    }

    return (
        <div className="flex w-full flex-col gap-2">
            {label ? (
                <Label className={labelClassName} htmlFor={datePickerId}>
                    {label}
                </Label>
            ) : null}

            {/* Date Picker Trigger Container (Handles borders, pill background) */}
            <div
                className={cn(
                    "relative flex h-[34px] w-full items-center rounded-xl border border-control-border-subtle transition-all focus-within:border-field-border focus-within:ring-2 focus-within:ring-focus-ring/20",
                    "bg-surface-raised focus-within:bg-surface-raised",
                    variant === "light"
                        ? "bg-field-subtle-background border-section-border focus-within:bg-field-subtle-background focus-within:border-section-border"
                        : "",
                    containerClassName,
                    error && "border-danger focus-within:border-danger",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                <Popover>
                    <PopoverTrigger
                        render={
                            <Button
                                ref={ref}
                                id={datePickerId}
                                variant="bare"
                                disabled={disabled}
                                data-empty={!selectedDate}
                                className={cn(
                                    "h-full w-full justify-between rounded-[inherit] px-3.5 md:px-3.5 text-left text-sm font-normal text-field-text hover:bg-transparent focus-visible:ring-0 data-[empty=true]:text-placeholder disabled:cursor-not-allowed",
                                    className
                                )}
                                aria-describedby={
                                    error
                                        ? errorId
                                        : hint
                                            ? hintId
                                            : undefined
                                }
                                aria-invalid={Boolean(error) || undefined}
                            >
                                {selectedDate ? (
                                    formatDate(selectedDate, dateFormat)
                                ) : (
                                    <span>{placeholder}</span>
                                )}
                                <CalendarIcon
                                    className="size-4 shrink-0 text-content-muted"
                                    aria-hidden
                                />
                            </Button>
                        }
                    />
                    {/* Locked above the trigger and centered on it. `shift` keeps the
                        requested side instead of letting the popup flip below the field;
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
                            className="p-3 [--cell-radius:10px] [--cell-size:2rem] [&_button[data-day]]:p-0 [&_button[data-day]]:text-sm [&_button[data-day]]:text-inherit [&_button[data-day]:hover]:bg-interactive-active-background [&_button[data-selected-single=true]]:bg-primary [&_button[data-selected-single=true]]:text-primary-contrast [&_button[data-selected-single=true]:hover]:bg-primary-hover"
                            classNames={{
                                month_caption: "flex h-(--cell-size) w-full items-center justify-center rounded-lg bg-field-subtle-background px-(--cell-size)",
                                caption_label: "text-sm font-medium select-none",
                                button_previous: "inline-flex size-(--cell-size) items-center justify-center rounded-lg text-content-muted transition-colors hover:bg-interactive-active-background hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/20 aria-disabled:opacity-50",
                                button_next: "inline-flex size-(--cell-size) items-center justify-center rounded-lg text-content-muted transition-colors hover:bg-interactive-active-background hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/20 aria-disabled:opacity-50",
                                weekday: "flex-1 text-sm font-normal text-content-muted select-none",
                                today: "rounded-[10px] bg-interactive-active-background text-primary",
                                outside: "text-content-muted opacity-50",
                                disabled: "text-content-muted opacity-40",
                            }}
                            mode="single"
                            selected={selectedDate}
                            defaultMonth={selectedDate ?? defaultValue}
                            onSelect={handleSelect}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {error ? (
                <FieldError id={errorId} className="inline-flex items-center gap-1">
                    <Info className="size-3.5 shrink-0" aria-hidden />
                    {error}
                </FieldError>
            ) : null}
            {hint ? <HelperText id={hintId}>{hint}</HelperText> : null}
        </div>
    )
}

export { DatePicker }
