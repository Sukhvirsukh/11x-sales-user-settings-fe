import { useState, type KeyboardEvent } from "react";
import { ArrowUpIcon, ImageIcon, SendIcon } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  primaryColor?: string;
}

export function ChatInput({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  primaryColor = "blue",
}: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-2.5 py-1.5">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Ask AI..."}
        className="min-w-0 flex-1 bg-transparent text-body-sm text-foreground outline-none placeholder:text-placeholder"
      />
      <button
        type="button"
        aria-label="Attach image"
        className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
      >
        <ImageIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={handleSend}
        disabled={!value.trim()}
        aria-label="Send message"
        className="flex size-7 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        style={{ backgroundColor: primaryColor }}
      >
        <ArrowUpIcon className="size-3.5" />
      </button>
    </div>
  );
}
