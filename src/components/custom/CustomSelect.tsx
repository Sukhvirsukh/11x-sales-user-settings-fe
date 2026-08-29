import { useId, type ComponentProps } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CustomLabel } from "./CustomLabel";

interface CustomSelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string;
  hint?: string;
  options: CustomSelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  id?: string;
  className?: string;
  triggerClassName?: string;
  onValueChange?: ComponentProps<typeof Select>["onValueChange"];
}

export function CustomSelect({
  label,
  hint,
  options,
  value,
  defaultValue,
  placeholder,
  id,
  className,
  triggerClassName,
  onValueChange,
}: CustomSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hintId = `${selectId}-hint`;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      {label && <CustomLabel htmlFor={selectId}>{label}</CustomLabel>}
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      >
        <SelectTrigger
          id={selectId}
          aria-describedby={hint ? hintId : undefined}
          className={cn(
            "h-10 w-full rounded-xl border-border bg-card text-body shadow-none",
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hint && (
        <p id={hintId} className="text-caption text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}
