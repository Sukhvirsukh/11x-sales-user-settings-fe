import { useState, type KeyboardEvent } from "react";
import { SendIcon } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-end gap-2 rounded-xl border border-border bg-muted px-3 py-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-placeholder focus:outline-none"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-chat text-primary-foreground transition-colors hover:bg-chat-hover disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <SendIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
