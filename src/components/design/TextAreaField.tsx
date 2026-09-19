import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { FieldError } from "@/components/ui/field"
import Label from "./Label"
import HelperText from "./HelperText"

export interface TextAreaFieldProps extends React.ComponentProps<"textarea"> {
    label?: string
    hint?: string
    error?: string
    containerClassName?: string
    wrapperClassName?: string
    variant?: "default" | "light"
    labelClassName?: string
}

const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
    (
        {
            label,
            hint,
            error,
            containerClassName,
            wrapperClassName,
            className,
            id,
            variant = "light",
            labelClassName,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId()
        const textareaId = id || generatedId
        const hintId = `${textareaId}-hint`

        return (
            <div className={cn("flex w-full flex-col gap-2", wrapperClassName)}>
                {label ? <Label className={labelClassName} htmlFor={textareaId}>{label}</Label> : null}

                <Textarea
                    id={textareaId}
                    ref={ref}
                    className={cn(
                        "min-h-[80px] w-full rounded-xl border border-control-border-subtle px-3.5 py-2 transition-all focus-visible:border-field-border focus-visible:ring-2 focus-visible:ring-focus-ring/20",
                        "bg-surface-raised focus-visible:bg-surface-raised",
                        "text-sm text-field-text placeholder:text-placeholder",
                        variant === "light"
                            ? "bg-field-subtle-background border-section-border focus-visible:bg-field-subtle-background focus-visible:border-section-border"
                            : "",
                        containerClassName,
                        className,
                        error && "border-danger focus-visible:border-danger"
                    )}
                    aria-describedby={
                        error
                            ? `${textareaId}-error`
                            : hint
                                ? hintId
                                : undefined
                    }
                    aria-invalid={Boolean(error) || undefined}
                    {...props}
                />

                {error ? (
                    <FieldError id={`${textareaId}-error`} className="inline-flex items-center gap-1">
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

TextAreaField.displayName = "TextAreaField"

export { TextAreaField }
