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
            id,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId()
        const inputId = id || generatedId
        const hintId = `${inputId}-hint`

        return (
            <div className="flex w-full flex-col gap-2">
                {label ? <Label htmlFor={inputId}>{label}</Label> : null}

                {/* Input Outer Container (Handles borders, icons, pill background) */}
                <div
                    className={cn(
                        "relative flex h-[34px] w-full items-center rounded-xl border border-border-soft px-3.5 transition-all focus-within:border-border-soft focus-within:ring-2 focus-within:ring-blue-400/20 dark:border-slate-800",
                        "bg-white focus-within:bg-white dark:bg-slate-900/40 dark:focus-within:bg-slate-900",
                        containerClassName,
                        error && "border-danger focus-within:border-danger"
                    )}
                >
                    {startIcon && (
                        <div className="mr-2.5 flex items-center justify-center text-ghost">
                            {startIcon}
                        </div>
                    )}

                    {/* Base Primitive Input */}
                    <Input
                        id={inputId}
                        ref={ref}
                        className={className}
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
                        <div className="ml-2.5 flex items-center justify-center text-ghost">
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
