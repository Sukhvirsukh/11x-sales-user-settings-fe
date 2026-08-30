import { useId, type ComponentProps } from "react";
import { CircleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CustomLabel } from "./CustomLabel";

interface CustomInputProps extends ComponentProps<typeof Input> {
  label?: string;
  labelPosition?: "top" | "left";
  error?: string;
  hint?: string;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
}

export function CustomInput({
  id,
  label,
  labelPosition = "top",
  error,
  hint,
  labelClassName,
  inputClassName,
  containerClassName,
  className,
  "aria-invalid": ariaInvalid,
  ...props
}: CustomInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const hasError = Boolean(error);

  return (
    <div
      className={cn(
        "flex min-w-0",
        labelPosition === "left" ? "flex-row items-center gap-3" : "flex-col gap-1.5",
        containerClassName,
      )}
    >
      {label && (
        <CustomLabel htmlFor={inputId} className={labelClassName}>
          {label}
        </CustomLabel>
      )}
      <div className="min-w-0 w-full">
        <Input
          id={inputId}
          aria-invalid={hasError || Boolean(ariaInvalid)}
          aria-describedby={
            hasError ? errorId : hint ? hintId : undefined
          }
          className={cn(
            "h-10 rounded-lg border-border bg-card text-body shadow-none",
            inputClassName,
            className,
          )}
          {...props}
        />
        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="mt-1 flex items-start gap-1.5 text-caption text-destructive"
          >
            <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
            {error}
          </p>
        )}
        {hint && !hasError && (
          <p id={hintId} className="mt-1 text-caption text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
