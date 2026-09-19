import { useState } from "react";
import { Field, FieldError } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import Label from "./Label";

export type ChatBubbleType = "type-bar" | "compact-bar" | "classic-bar" | "custom";

interface ChatBubbleTypeOption {
  value: ChatBubbleType;
  label: string;
  placeholder?: string;
}

interface ChatBubbleTypeSelectorProps {
  value?: ChatBubbleType;
  onValueChange?: (value: ChatBubbleType) => void;
  label?: string;
  error?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

const BUBBLE_OPTIONS = [
  { value: "type-bar", label: "Type bar", placeholder: "Ask AI..." },
  { value: "compact-bar", label: "Compact bar" },
  { value: "classic-bar", label: "Classic bar", placeholder: "Type a message" },
  { value: "custom", label: "Custom bar", placeholder: "Type your query here..." },
] satisfies readonly ChatBubbleTypeOption[];

const DEFAULT_VALUE: ChatBubbleType = "type-bar";

function isChatBubbleType(value: string): value is ChatBubbleType {
  return BUBBLE_OPTIONS.some((option) => option.value === value);
}

function BarPreview({
  placeholder,
  centered = false,
}: {
  placeholder?: string;
  centered?: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-[205px] rounded-xl border border-section-border bg-background px-3 py-2.5 text-sm text-muted-foreground",
        centered && "text-center",
      )}
    >
      {placeholder}
    </div>
  );
}

function BubblePreview({ option }: { option: ChatBubbleTypeOption }) {
  if (option.value === "compact-bar") {
    return (
      <div className="flex size-11 items-center justify-center rounded-xl border border-section-border bg-background">
        <span className="size-5 rounded bg-input" />
      </div>
    );
  }

  return (
    <BarPreview
      placeholder={option.placeholder}
      centered={option.value === "classic-bar"}
    />
  );
}

export function ChatBubbleTypeSelector({
  value: controlledValue,
  onValueChange,
  label = "Chat bubble type",
  error,
  id = "chat-bubble-type",
  disabled = false,
  className,
}: ChatBubbleTypeSelectorProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<ChatBubbleType>(DEFAULT_VALUE);
  const value = controlledValue ?? uncontrolledValue;

  function handleValueChange(nextValue: string) {
    if (!isChatBubbleType(nextValue)) return;
    if (controlledValue === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  }

  return (
    <Field className={className}>
      <Label>{label}</Label>
      <RadioGroup
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className="gap-3"
      >
        {BUBBLE_OPTIONS.map((option) => {
          const optionId = `${id}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                "cursor-pointer overflow-hidden rounded-[10px] border border-section-border bg-background transition-colors",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <div className="flex items-center gap-2 bg-primary/10 px-2.5 py-2 text-base text-muted-foreground">
                <RadioGroupItem
                  id={optionId}
                  value={option.value}
                  disabled={disabled}
                />
                {option.label}
              </div>
              <div className="flex min-h-16 items-center justify-center px-7.5! py-2.5">
                <BubblePreview option={option} />
              </div>
            </label>
          );
        })}
      </RadioGroup>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
