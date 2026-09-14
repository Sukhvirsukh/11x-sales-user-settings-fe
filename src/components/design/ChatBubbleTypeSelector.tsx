import { useState } from "react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldError } from "@/components/ui/field";
import Label from "./Label";

export type ChatBubbleType = "type-bar" | "compact-bar" | "classic-bar" | "custom";

interface ChatBubbleTypeOption {
    value: ChatBubbleType;
    label: string;
    placeholder?: string;
}

interface ChatBubbleTypeSelectorProps {
    /** Currently selected bubble type */
    value?: ChatBubbleType;
    /** Callback when selection changes */
    onValueChange?: (value: ChatBubbleType) => void;
    /** Label for the field group */
    label?: string;
    /** Error message */
    error?: string;
    /** Unique ID for the field */
    id?: string;
    /** Disable the entire field */
    disabled?: boolean;
    /** Custom class names */
    className?: string;
}

const BUBBLE_OPTIONS: ChatBubbleTypeOption[] = [
    { value: "type-bar", label: "Type bar", placeholder: "Ask AI..." },
    { value: "compact-bar", label: "Compact bar" },
    { value: "classic-bar", label: "Classic bar", placeholder: "Type a message" },
    { value: "custom", label: "Custom", placeholder: "Type your query here..." },
];

function TypeBarPreview({ placeholder }: { placeholder?: string }) {
    return (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-placeholder" />
            <span className="text-xs text-placeholder">{placeholder}</span>
        </div>
    );
}

function CompactBarPreview() {
    return (
        <div className="flex items-center justify-center">
            <div className="h-10 w-10 rounded-xl border border-border bg-muted flex items-center justify-center">
                <svg
                    className="h-5 w-5 text-placeholder"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                    />
                </svg>
            </div>
        </div>
    );
}

function ClassicBarPreview({ placeholder }: { placeholder?: string }) {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
            <div className="flex-1">
                <span className="text-xs text-placeholder">{placeholder}</span>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                <svg
                    className="h-3 w-3 text-placeholder"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                </svg>
            </div>
        </div>
    );
}

function BubblePreview({ type, placeholder }: { type: ChatBubbleType; placeholder?: string }) {
    switch (type) {
        case "type-bar":
            return <TypeBarPreview placeholder={placeholder} />;
        case "compact-bar":
            return <CompactBarPreview />;
        case "classic-bar":
            return <ClassicBarPreview placeholder={placeholder} />;
        case "custom":
            return <TypeBarPreview placeholder={placeholder} />;
        default:
            return null;
    }
}

const DEFAULT_VALUE: ChatBubbleType = "type-bar";

export function ChatBubbleTypeSelector({
    value: controlledValue,
    onValueChange,
    label = "Chat bubble type",
    error,
    disabled = false,
    className,
}: ChatBubbleTypeSelectorProps) {
    const [uncontrolledValue, setUncontrolledValue] = useState<ChatBubbleType>(DEFAULT_VALUE);
    const value = controlledValue ?? uncontrolledValue;
    const handleChange = controlledValue !== undefined ? onValueChange : setUncontrolledValue;
    const hasError = Boolean(error);

    return (
        <Field className={className}>
            <Label>{label}</Label>
            <RadioGroup
                value={value}
                onValueChange={(val) => handleChange?.(val as ChatBubbleType)}
                disabled={disabled}
                aria-invalid={hasError}
                className="gap-3"
            >
                {BUBBLE_OPTIONS.map((option) => (
                    <Label
                        key={option.value}
                        htmlFor={option.value}
                        className={cn(
                            "flex w-full flex-col items-center rounded-lg border transition-colors cursor-pointer text-center",
                            "has-[:focus-visible]:border-ring has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50",
                            value === option.value ? "border-primary bg-primary/10" : "border-border bg-card-nested",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {/* Upper part: Radio + Text */}
                        <div className={cn(
                            "flex w-full items-center justify-center px-3 py-2",
                            value === option.value ? "bg-primary text-primary-foreground rounded-t-lg" : "rounded-t-lg"
                        )}>
                            <RadioGroupItem
                                value={option.value}
                                id={option.value}
                                disabled={disabled}
                                className="sr-only"
                            />
                            <span>{option.label}</span>
                        </div>
                        {/* Bottom part: Preview (centered) */}
                        <div className={cn(
                            "flex items-center justify-center px-3 py-3",
                            value === option.value ? "rounded-b-lg" : "rounded-b-lg"
                        )}>
                            <BubblePreview type={option.value} placeholder={option.placeholder} />
                        </div>
                    </Label>
                ))}
            </RadioGroup>
            {hasError && (
                <FieldError>{error}</FieldError>
            )}
        </Field>
    );
}
