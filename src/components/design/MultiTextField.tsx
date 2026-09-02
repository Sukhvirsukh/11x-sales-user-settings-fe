import {
    useId,
    useState,
    type KeyboardEvent,
    type ClipboardEvent,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Label from "@/components/design/Label";
import HelperText from "@/components/design/HelperText";

export interface MultiTextFieldProps {
    label?: string;
    hint?: string;
    error?: string;
    placeholder?: string;
    value?: string[];
    onValueChange?: (tags: string[]) => void;
    defaultValue?: string[];
    id?: string;
    disabled?: boolean;
    className?: string;
    containerClassName?: string;
    separator?: string;
}

export function MultiTextField({
    label,
    hint,
    error,
    placeholder = "Type and press Enter...",
    value: controlledValue,
    onValueChange,
    defaultValue = [],
    id,
    disabled = false,
    className,
    containerClassName,
    separator = "Enter",
}: MultiTextFieldProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const [uncontrolledTags, setUncontrolledTags] =
        useState<string[]>(defaultValue);
    const [inputValue, setInputValue] = useState("");

    const isControlled = controlledValue !== undefined;
    const tags = isControlled ? controlledValue : uncontrolledTags;

    function updateTags(next: string[]) {
        if (!isControlled) setUncontrolledTags(next);
        onValueChange?.(next);
    }

    function handleRemoveTag(tagToRemove: string) {
        if (disabled) return;
        updateTags(tags.filter((tag) => tag !== tagToRemove));
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (disabled) return;

        if (e.key === separator && inputValue.trim()) {
            e.preventDefault();
            const next = inputValue.trim();
            if (!tags.includes(next)) updateTags([...tags, next]);
            setInputValue("");
            return;
        }

        if (e.key === "Backspace" && !inputValue && tags.length > 0) {
            updateTags(tags.slice(0, -1));
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
        if (newItems.length > 0) updateTags([...tags, ...newItems]);
    }

    return (
        <div className={cn("flex w-full flex-col gap-1.5", className)}>
            {label ? <Label htmlFor={inputId}>{label}</Label> : null}

            <div
                className={cn(
                    "relative flex min-h-[90px] w-full flex-wrap items-center gap-1.5 rounded-xl border border-border-soft px-3.5 py-2 transition-all focus-within:border-border-soft focus-within:ring-2 focus-within:ring-blue-400/20 dark:border-slate-800",
                    "bg-white focus-within:bg-white dark:bg-slate-900/40 dark:focus-within:bg-slate-900",
                    error &&
                    "border-red-400 focus-within:border-red-400 focus-within:ring-red-400/20",
                    disabled && "pointer-events-none opacity-50",
                    containerClassName
                )}
            >
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex max-w-full items-center gap-1 rounded-sm bg-border-light p-1.5 text-sm font-normal text-foreground"
                    >
                        <span className="truncate">{tag}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={`Remove ${tag}`}
                        >
                            <X className="size-3.5" />
                        </button>
                    </span>
                ))}

                <Input
                    id={inputId}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder={tags.length === 0 ? placeholder : "Add..."}
                    disabled={disabled}
                    aria-describedby={
                        [hint ? hintId : null, error ? errorId : null]
                            .filter(Boolean)
                            .join(" ") || undefined
                    }
                    aria-invalid={Boolean(error) || undefined}
                    className={cn(
                        "h-auto min-w-[5.5rem] flex-1 py-0.5",
                        tags.length === 0 && "w-full min-w-0"
                    )}
                />
            </div>

            {error ? (
                <span id={errorId} className="text-xs text-red-500">
                    {error}
                </span>
            ) : null}

            {!error && hint ? (
                <HelperText id={hintId}>{hint}</HelperText>
            ) : null}
        </div>
    );
}
