import * as React from "react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FieldError } from "@/components/ui/field"
import Label from "./Label"
import HelperText from "./HelperText"

export interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

export interface SelectFieldProps {
    /** Label displayed above the select */
    label?: string
    /** Hint text displayed below the select */
    hint?: string
    /** Error message displayed below the select */
    error?: string
    /** Placeholder text when no value is selected */
    placeholder?: string
    /** List of options */
    options: SelectOption[]
    /** Controlled value */
    value?: string
    /** Default value (uncontrolled mode) */
    defaultValue?: string
    /** Callback when value changes */
    onValueChange?: (value: string | null) => void
    /** Unique ID for the select */
    id?: string
    /** Disable the entire select */
    disabled?: boolean
    /** Custom class names for the trigger */
    className?: string
    /** Custom class names for the container */
    containerClassName?: string
    /** Custom class names for the dropdown content */
    contentClassName?: string
    /** Visual variant of the select */
    variant?: "default" | "light"
    labelClassName?: string
}

const SelectField = React.forwardRef<
    React.ComponentRef<typeof SelectTrigger>,
    SelectFieldProps
>(
    (
        {
            label,
            hint,
            error,
            placeholder = "Select an option",
            options,
            value,
            defaultValue,
            onValueChange,
            id,
            disabled = false,
            className,
            containerClassName,
            contentClassName,
            variant = "light",
            labelClassName
        },
        ref
    ) => {
        const generatedId = React.useId()
        const selectId = id || generatedId
        const hintId = `${selectId}-hint`
        const errorId = `${selectId}-error`

        return (
            <div className="flex w-full flex-col gap-2">
                {label ? (
                    <Label htmlFor={selectId} className={labelClassName}>{label}</Label>
                ) : null}

                {/* Select Trigger Container */}
                <Select
                    items={options}
                    value={value}
                    defaultValue={defaultValue}
                    onValueChange={onValueChange}
                    disabled={disabled}
                >
                    <SelectTrigger
                        ref={ref}
                        id={selectId}
                        className={cn(
                            "h-[34px] w-full rounded-xl border border-field-border px-3.5 transition-all focus-visible:border-field-border focus-visible:ring-2 focus-visible:ring-blue-400/20 dark:border-slate-800 data-placeholder:text-slate-400 dark:data-placeholder:text-slate-500",
                            variant === "light"
                                ? "bg-surface-subtle border-section-border focus-visible:bg-surface-subtle focus-visible:border-section-border dark:bg-slate-800/60 dark:focus-visible:bg-slate-800/60"
                                : "bg-surface-raised focus-visible:bg-surface-raised",
                            containerClassName,
                            error && "border-danger focus-visible:border-danger",
                            disabled && "opacity-50 cursor-not-allowed",
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
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent
                        className={cn(
                            // Match the trigger surface so the dropdown reads as part of the field.
                            "font-sans",
                            variant === "light"
                                ? "border-section-border bg-surface-subtle dark:border-slate-800 dark:bg-slate-800"
                                : "border-field-border bg-surface-raised dark:border-slate-800",
                            contentClassName
                        )}
                    >
                        {options.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Error Message */}
                {error ? (
                    <FieldError id={errorId} className="inline-flex items-center gap-1">
                        <Info className="size-3.5 shrink-0" aria-hidden />
                        {error}
                    </FieldError>
                ) : null}

                {/* Hint Text */}
                {hint && !error ? (
                    <HelperText id={hintId}>{hint}</HelperText>
                ) : null}
            </div>
        )
    }
)

SelectField.displayName = "SelectField"

export { SelectField }
