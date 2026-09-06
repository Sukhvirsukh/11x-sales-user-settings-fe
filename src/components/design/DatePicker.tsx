import * as React from "react"
import { format as formatDate } from "date-fns"
import { ChevronDownIcon, Info } from "lucide-react"
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
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
    (
        {
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
            variant = "default",
        },
        ref
    ) => {
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
                        "relative flex h-[34px] w-full items-center rounded-xl border border-border-soft transition-all focus-within:border-border-soft focus-within:ring-2 focus-within:ring-blue-400/20 dark:border-slate-800",
                        "bg-white focus-within:bg-white dark:bg-slate-900/40 dark:focus-within:bg-slate-900",
                        variant === "light"
                            ? "bg-light border-section-border focus-within:bg-light focus-within:border-section-border dark:bg-slate-800/60 dark:focus-within:bg-slate-800/60"
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
                                        "h-full w-full justify-between rounded-[inherit] px-3.5 text-left text-sm font-normal text-slate-800 hover:bg-transparent focus-visible:ring-0 dark:text-slate-200 data-[empty=true]:text-slate-400 disabled:cursor-not-allowed",
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
                                    <ChevronDownIcon
                                        className="size-4 shrink-0 text-ghost"
                                        aria-hidden
                                    />
                                </Button>
                            }
                        />
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
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
)

DatePicker.displayName = "DatePicker"

export { DatePicker }
