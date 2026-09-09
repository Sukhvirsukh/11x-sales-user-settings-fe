import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { ChatBubbleType } from "@/components/design/ChatBubbleTypeSelector";

export interface ChatBubbleButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type"> {
    primaryColor?: string;
    placeholder?: string;
    size?: number;
}

function ChatIcon({ size = 20, className }: { size?: number; className?: string }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
        </svg>
    );
}

function SendIcon({ size = 10, className }: { size?: number; className?: string }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
        </svg>
    );
}

/** Type bar — rounded input-style trigger with leading status dot */
export function TypeBarButton({
    primaryColor = "#2F6DF3",
    placeholder = "Ask AI...",
    size = 56,
    className,
    ...props
}: ChatBubbleButtonProps) {
    return (
        <button
            type="button"
            aria-label="Open chat"
            className={cn(
                "flex items-center gap-2 rounded-2xl border border-border bg-white px-3 shadow-lg transition-shadow hover:shadow-xl",
                className,
            )}
            style={{ width: "min(100%, 260px)", height: Math.max(size * 0.65, 40) }}
            {...props}
        >
            <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: primaryColor, opacity: 0.55 }}
            />
            <span className="min-w-0 flex-1 truncate text-left text-[11px] text-muted-foreground">
                {placeholder}
            </span>
        </button>
    );
}

/** Compact bar — square icon button */
export function CompactBarButton({
    primaryColor = "#2F6DF3",
    size = 56,
    className,
    ...props
}: ChatBubbleButtonProps) {
    return (
        <button
            type="button"
            aria-label="Open chat"
            className={cn(
                "flex items-center justify-center rounded-xl shadow-lg transition-shadow hover:shadow-xl",
                className,
            )}
            style={{
                width: size,
                height: size,
                backgroundColor: primaryColor,
            }}
            {...props}
        >
            <ChatIcon size={size * 0.45} className="text-white" />
        </button>
    );
}

/** Classic bar — pill input with send control */
export function ClassicBarButton({
    primaryColor = "#2F6DF3",
    placeholder = "Type a message",
    size = 56,
    className,
    ...props
}: ChatBubbleButtonProps) {
    return (
        <button
            type="button"
            aria-label="Open chat"
            className={cn(
                "flex items-center gap-2 rounded-full border border-border bg-white px-3 shadow-lg transition-shadow hover:shadow-xl",
                className,
            )}
            style={{ width: "min(100%, 260px)", height: Math.max(size * 0.65, 40) }}
            {...props}
        >
            <span className="min-w-0 flex-1 truncate text-center text-[11px] text-muted-foreground">
                {placeholder}
            </span>
            <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: primaryColor }}
            >
                <SendIcon className="text-white" />
            </span>
        </button>
    );
}

/** Custom — rectangular input-style trigger */
export function CustomBarButton({
    primaryColor = "#2F6DF3",
    placeholder = "Type your query here...",
    size = 56,
    className,
    ...props
}: ChatBubbleButtonProps) {
    return (
        <button
            type="button"
            aria-label="Open chat"
            className={cn(
                "flex items-center gap-2 rounded-lg border border-border bg-white px-3 shadow-lg transition-shadow hover:shadow-xl",
                className,
            )}
            style={{ width: "min(100%, 260px)", height: Math.max(size * 0.65, 40) }}
            {...props}
        >
            <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: primaryColor }}
            />
            <span className="min-w-0 flex-1 truncate text-left text-[11px] text-muted-foreground">
                {placeholder}
            </span>
        </button>
    );
}

const DEFAULT_PLACEHOLDERS: Record<ChatBubbleType, string> = {
    "type-bar": "Ask AI...",
    "compact-bar": "",
    "classic-bar": "Type a message",
    custom: "Type your query here...",
};

interface ChatBubbleButtonSwitcherProps extends ChatBubbleButtonProps {
    type: ChatBubbleType;
}

/** Renders the floating chat trigger for the selected bubble type */
export function ChatBubbleButton({
    type,
    placeholder,
    ...props
}: ChatBubbleButtonSwitcherProps) {
    const resolvedPlaceholder = placeholder || DEFAULT_PLACEHOLDERS[type];

    switch (type) {
        case "type-bar":
            return <TypeBarButton placeholder={resolvedPlaceholder} {...props} />;
        case "compact-bar":
            return <CompactBarButton {...props} />;
        case "classic-bar":
            return <ClassicBarButton placeholder={resolvedPlaceholder} {...props} />;
        case "custom":
            return <CustomBarButton placeholder={resolvedPlaceholder} {...props} />;
        default:
            return <TypeBarButton placeholder={resolvedPlaceholder} {...props} />;
    }
}

export function isBarBubbleType(type: ChatBubbleType) {
    return type === "type-bar" || type === "classic-bar" || type === "custom";
}
