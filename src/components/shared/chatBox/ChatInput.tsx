import { ArrowUpIcon, ImageIcon } from "lucide-react";
import { useState } from "react";

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
    <div className="flex items-center justify-between rounded-[10px] border border-[rgba(0,0,0,0.21)] bg-[#F7F7F7] px-[19px] py-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Ask AI..."}
        className="min-w-0 flex-1 bg-transparent text-xs tracking-[0.02em] text-foreground outline-none placeholder:text-[#808080]"
      />
      <button
        type="button"
        aria-label="Attach image"
        className="relative flex size-5 shrink-0 items-center justify-center rounded-[3px] border border-[#808080] text-[0px] transition-colors hover:bg-black/5"
      >
        <ImageIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={handleSend}
        disabled={!value.trim()}
        aria-label="Send message"
        className="ml-[9px] flex size-[22px] shrink-0 items-center justify-center rounded-full text-sm leading-none text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        style={{ backgroundColor: primaryColor }}
      >
        <ArrowUpIcon className="size-3.5" />
      </button>
    </div>
  );
}
