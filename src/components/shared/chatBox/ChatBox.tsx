import { useRef, useEffect } from "react";
import { XIcon } from "lucide-react";
import { ChatMessage, type ChatMessageProps } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface ChatBoxProps {
  messages: ChatMessageProps[];
  onSendMessage: (message: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  title?: string;
  onClose?: () => void;
}

export function ChatBox({
  messages,
  onSendMessage,
  placeholder = "Type a message...",
  className = "",
  disabled = false,
  title = "Chat",
  onClose,
}: ChatBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`flex h-full flex-col bg-white ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E6E6E8] px-4 py-3">
        <h3 className="text-sm font-semibold text-[#111113]">{title}</h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[#6d6d76] hover:bg-[#f3f3f5] transition-colors"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F3F5]">
                <svg
                  className="h-6 w-6 text-[#A5A5AD]"
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
              <p className="mt-3 text-sm font-medium text-[#111113]">
                Start a conversation
              </p>
              <p className="mt-1 text-xs text-[#A5A5AD]">
                Ask questions about your data
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} {...message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-[#E6E6E8] px-4 py-3">
        <ChatInput
          onSend={onSendMessage}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
