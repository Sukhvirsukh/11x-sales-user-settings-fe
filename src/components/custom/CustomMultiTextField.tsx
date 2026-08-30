import { useId, useState, type KeyboardEvent, type ClipboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomLabel } from "./CustomLabel";

interface CustomMultiTextFieldProps {
  label: string;
  hint?: string;
  placeholder?: string;
  value?: string[];
  onValueChange?: (tags: string[]) => void;
  defaultValue?: string[];
  id?: string;
  disabled?: boolean;
  className?: string;
  separator?: string;
}

export function CustomMultiTextField({
  label,
  hint,
  placeholder = "Type and press Enter...",
  value: controlledValue,
  onValueChange,
  defaultValue = [],
  id,
  disabled = false,
  className,
  separator = "Enter",
}: CustomMultiTextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const [uncontrolledTags, setUncontrolledTags] = useState<string[]>(defaultValue);
  const [inputValue, setInputValue] = useState("");

  const tags = controlledValue ?? uncontrolledTags;
  const setTags = controlledValue !== undefined ? onValueChange : setUncontrolledTags;

  function handleRemoveTag(tagToRemove: string) {
    if (disabled) return;
    setTags?.(tags.filter((tag) => tag !== tagToRemove));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (e.key === separator && inputValue.trim()) {
      e.preventDefault();
      const next = inputValue.trim();
      if (!tags.includes(next)) setTags?.([...tags, next]);
      setInputValue("");
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    if (disabled) return;
    const pastedText = e.clipboardData.getData("text");
    if (!pastedText.includes("\n") && !pastedText.includes(",")) return;

    e.preventDefault();
    const newItems = pastedText
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter((item) => item && !tags.includes(item));
    if (newItems.length > 0) setTags?.([...tags, ...newItems]);
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <CustomLabel htmlFor={inputId}>{label}</CustomLabel>
      <div
        className={cn(
          "flex min-h-10 flex-wrap items-center gap-1.5 rounded-xl border border-border bg-card px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring/40",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex max-w-full items-center gap-1 rounded-md border border-border bg-muted/80 px-2 py-0.5 text-caption text-muted-foreground"
          >
            <span className="truncate">{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="shrink-0 text-placeholder hover:text-foreground/80"
              aria-label={`Remove ${tag}`}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          id={inputId}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={tags.length === 0 ? placeholder : "Add..."}
          disabled={disabled}
          aria-describedby={hint ? hintId : undefined}
          className={cn(
            "min-w-[5.5rem] bg-transparent py-0.5 text-body-sm text-foreground outline-none",
            tags.length === 0 && "w-full min-w-0",
          )}
        />
      </div>
      {hint && (
        <p id={hintId} className="text-caption leading-snug text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}
