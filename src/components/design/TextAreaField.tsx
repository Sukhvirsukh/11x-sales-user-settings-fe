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
            variant = "default",
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId()
        const textareaId = id || generatedId
        const hintId = `${textareaId}-hint`

        return (
            <div className={cn("flex w-full flex-col gap-2", wrapperClassName)}>
                {label ? <Label htmlFor={textareaId}>{label}</Label> : null}

                <Textarea
                    id={textareaId}
                    ref={ref}
                    className={cn(
                        "min-h-[80px] w-full rounded-xl border border-border-soft px-3.5 py-2 transition-all focus-visible:border-border-soft focus-visible:ring-2 focus-visible:ring-blue-400/20 dark:border-slate-800",
                        "bg-card-nested focus-visible:bg-card-nested",
                        "text-sm text-slate-800 placeholder:text-slate-400 dark:text-slate-200",
                        variant === "light"
                            ? "bg-light border-section-border focus-visible:bg-light focus-visible:border-section-border dark:bg-slate-800/60 dark:focus-visible:bg-slate-800/60"
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
