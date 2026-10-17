import * as React from "react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input, type InputProps } from "../ui/input"
import { FieldError } from "../ui/field"
import Label from "./Label"
import HelperText from "./HelperText"

export interface InputFieldProps extends InputProps {
    label?: string
    hint?: string
    error?: string
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
    containerClassName?: string
    labelClassName?: string
    variant?: "default" | "light"
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    (
        {
            label,
            hint,
            error,
            startIcon,
            endIcon,
            containerClassName,
            className,
            labelClassName,
            id,
            variant = "light",
            type,
            onKeyDown,
            onPaste,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId()
        const inputId = id || generatedId
        const hintId = `${inputId}-hint`
        const isNumberType = type === "number"

        /* Numeric fields: block printable keys that aren't digits (letters, e, -, .).
           Modifier combos and navigation/control keys stay untouched. */
        const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
            onKeyDown?.(event)
            if (!isNumberType || event.ctrlKey || event.metaKey || event.altKey) return
            if (event.key.length === 1 && !/[0-9]/.test(event.key)) event.preventDefault()
        }

        /* Keeps pasted/dropped text from bypassing the key filter. */
        const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
            onPaste?.(event)
            if (isNumberType && !/^\d*$/.test(event.clipboardData.getData("text"))) {
                event.preventDefault()
            }
        }

        return (
            <div className="flex w-full flex-col gap-1.5">
                {label ? <Label className={labelClassName} htmlFor={inputId}>{label}</Label> : null}

                {/* Input Outer Container (Handles borders, icons, pill background) */}
                <div
                    className={cn(
                        "relative flex h-10 w-full items-center rounded-lg border border-field-border bg-surface-raised px-3 shadow-panel transition-[border-color,box-shadow] [--input-autofill-bg:var(--surface-raised)] hover:border-border-strong focus-within:border-foreground/60 focus-within:ring-3 focus-within:ring-focus-ring/15",
                        variant === "light"
                            ? "bg-field-subtle-background [--input-autofill-bg:var(--field-subtle-background)] focus-within:bg-field-subtle-background"
                            : "",
                        containerClassName,
                        error && "border-danger focus-within:border-danger"
                    )}
                >
                    {startIcon && (
                        <div className="mr-2 flex items-center justify-center text-muted-foreground [&_svg]:size-4">
                            {startIcon}
                        </div>
                    )}

                    {/* Base Primitive Input */}
                    <Input
                        id={inputId}
                        ref={ref}
                        type={type}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        className={cn(
                            "max-sm:text-sm max-sm:placeholder:text-sm",
                            isNumberType &&
                            "[appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none",
                            className,
                        )}
                        aria-describedby={
                            error
                                ? `${inputId}-error`
                                : hint
                                    ? hintId
                                    : undefined
                        }
                        aria-invalid={Boolean(error) || undefined}
                        {...props}
                    />

                    {endIcon && (
                        <div className="ml-2.5 flex items-center justify-center text-content-muted">
                            {endIcon}
                        </div>
                    )}
                </div>

                {error ? (
                    <FieldError id={`${inputId}-error`} className="inline-flex items-center gap-1">
                        <Info className="size-3.5 shrink-0" aria-hidden />
                        {error}
                    </FieldError>
                ) : null}
                {hint ? (
                    <HelperText id={hintId}>{hint}</HelperText>
                ) : null}
            </div>
        )
    }
)

InputField.displayName = "InputField"

export { InputField }
