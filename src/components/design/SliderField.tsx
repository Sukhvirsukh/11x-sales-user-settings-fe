import { useId, useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { FieldError } from "@/components/ui/field";
import Label from "./Label";
import HelperText from "./HelperText";
import { FormGroup } from "./FormGroup";

interface SliderFieldProps
    extends Omit<
        ComponentProps<typeof Slider>,
        "defaultValue" | "value" | "onValueChange"
    > {
    label?: string;
    hint?: string;
    error?: string;
    unit?: string;
    defaultValue?: number;
    value?: number;
    onValueChange?: (value: number) => void;
}

export function SliderField({
    id,
    label,
    hint,
    error,
    unit,
    min = 0,
    max = 100,
    defaultValue = min,
    value: valueProp,
    onValueChange,
    className,
    ...props
}: SliderFieldProps) {
    const generatedId = useId();

    const sliderId = id ?? generatedId;
    const hintId = `${sliderId}-hint`;
    const errorId = `${sliderId}-error`;

    const [uncontrolled, setUncontrolled] = useState(defaultValue);

    const value = valueProp ?? uncontrolled;

    function handleValueChange(next: number) {
        if (valueProp === undefined) {
            setUncontrolled(next);
        }

        onValueChange?.(next);
    }

    return (
        <FormGroup className={cn("min-w-0", className)}>
            <div className="flex items-center justify-between gap-3">
                {label && (
                    <Label htmlFor={sliderId}>
                        {label}
                    </Label>
                )}

                <span className="text-caption tabular-nums text-muted-foreground">
                    {value}
                    {unit ? ` ${unit}` : ""}
                </span>
            </div>

            <Slider
                id={sliderId}
                min={min}
                max={max}
                {...props}
                value={[value]}
                defaultValue={[defaultValue]}
                onValueChange={(next) => {
                    const nextValue =
                        typeof next === "number" ? next : next[0] ?? min;

                    handleValueChange(nextValue);
                }}
                aria-describedby={
                    error
                        ? errorId
                        : hint
                            ? hintId
                            : undefined
                }
                aria-invalid={Boolean(error) || undefined}
                className={cn(
                    error && "[&_[data-slot=slider-track]]:bg-danger/20",
                    className
                )}
            />

            {error && (
                <FieldError id={errorId} className="inline-flex items-center gap-1">
                    {error}
                </FieldError>
            )}
            {hint && !error && (
                <HelperText id={hintId}>{hint}</HelperText>
            )}
        </FormGroup>
    );
}
