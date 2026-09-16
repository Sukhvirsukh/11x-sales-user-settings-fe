import { ArrowUpIcon, ImageIcon } from "lucide-react";
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";

export interface ChatInputProps {
  onSend: (message: string) => void;
  onImageUpload?: (files: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  primaryColor?: string;
}

export function ChatInput({
  onSend,
  onImageUpload,
  placeholder = "Type a message...",
  disabled = false,
  primaryColor = "blue",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length) onImageUpload?.(files);
    event.target.value = "";
  }

  return (
    <div className="flex h-[42px] items-center rounded-[10px] border border-primary/20 bg-table-header px-2.5">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handleImageUpload}
      />
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
        disabled={disabled}
        onClick={() => imageInputRef.current?.click()}
        className="flex size-5 shrink-0 items-center justify-center text-ghost transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ImageIcon className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        aria-label="Send message"
        className="ml-2 flex size-[22px] shrink-0 items-center justify-center rounded-full text-sm leading-none text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ backgroundColor: primaryColor }}
      >
        <ArrowUpIcon className="size-3.5" />
      </button>
    </div>
  );
}
