import { useId, useState, type ComponentProps } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { CustomLabel } from "./CustomLabel";

interface CustomSliderProps
  extends Omit<ComponentProps<typeof Slider>, "defaultValue" | "value"> {
  label?: string;
  hint?: string;
  unit?: string;
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
}

export function CustomSlider({
  id,
  label,
  hint,
  unit,
  min = 0,
  max = 100,
  defaultValue = min,
  value: valueProp,
  onValueChange,
  className,
  ...props
}: CustomSliderProps) {
  const generatedId = useId();
  const sliderId = id ?? generatedId;
  const hintId = `${sliderId}-hint`;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = valueProp ?? uncontrolled;

  function handleValueChange(next: number[]) {
    const nextValue = next[0] ?? min;
    if (valueProp === undefined) {
      setUncontrolled(nextValue);
    }
    onValueChange?.(nextValue);
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-3">
        {label && <CustomLabel htmlFor={sliderId}>{label}</CustomLabel>}
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
        onValueChange={handleValueChange}
        aria-describedby={hint ? hintId : undefined}
      />
      {hint && (
        <p id={hintId} className="text-caption text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}
