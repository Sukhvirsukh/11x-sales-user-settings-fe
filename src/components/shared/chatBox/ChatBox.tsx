import { useEffect, useMemo, useRef, useState } from "react";
import { XIcon } from "lucide-react";
import { useVisibilityStore } from "@/pages/chatSettings/store/chatVisibilityStore";
import { ChatMessage, type ChatMessageProps } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface ChatBoxProps {
  onClose?: () => void;
  className?: string;
}

function useChatFaceUrl(chatFace: File | string | null | undefined) {
  return useMemo(() => {
    if (!chatFace) return null;
    if (typeof chatFace === "string") return chatFace;
    return URL.createObjectURL(chatFace);
  }, [chatFace]);
}

function createWelcomeMessage(content: string): ChatMessageProps {
  return {
    id: "welcome",
    content,
    sender: "bot",
    timestamp: new Date(),
  };
}

export function ChatBox({ onClose, className = "" }: ChatBoxProps) {
  const fields = useVisibilityStore((s) => s.fields);

  const {
    agentName,
    chatFace,
    welcomeMessage,
    predefinedMessages,
    placeholderMessage,
    primaryColor,
    notificationColor,
  } = fields;

  const avatarUrl = useChatFaceUrl(chatFace);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessageProps[]>(() =>
    welcomeMessage ? [createWelcomeMessage(welcomeMessage)] : [],
  );

  useEffect(() => {
    return () => {
      if (chatFace instanceof File && avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl, chatFace]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(content: string) {
    const userMessage: ChatMessageProps = {
      id: crypto.randomUUID(),
      content,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: "Thanks for your message! How else can I help?",
          sender: "bot",
          timestamp: new Date(),
          avatar: avatarUrl ?? undefined,
        },
      ]);
    }, 500);
  }

  function handleClear() {
    setMessages(
      welcomeMessage ? [createWelcomeMessage(welcomeMessage)] : [],
    );
  }

  function handleCorrect(messageId: string, correctedContent: string) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, content: correctedContent } : m,
      ),
    );
  }

  function handleLike(messageId: string) {
    console.log("Liked message:", messageId);
  }

  function handleDislike(messageId: string) {
    console.log("Disliked message:", messageId);
  }

  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white/95 shadow-xl backdrop-blur-sm ${className}`}>
      {/* Header */}
      <div
        className="flex shrink-0 items-center justify-between gap-2 px-3 py-2.5"
        style={{ backgroundColor: `${primaryColor}22` }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="min-w-0 flex gap-2">
            <p className="truncate text-body-sm font-semibold text-foreground">
              {agentName}
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-success-muted px-1.5 py-0.5 text-micro font-medium text-success-strong">
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: notificationColor }}
              />
              Active
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            aria-label="Close chat"
            onClick={onClose}
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-muted/30 px-3 py-3">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <svg
                  className="h-6 w-6 text-placeholder"
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
              <p className="mt-3 text-sm font-medium text-foreground">
                Start a conversation
              </p>
              <p className="mt-1 text-xs text-placeholder">
                Ask questions about your data
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id}>
                <ChatMessage
                  {...message}
                  avatar={
                    message.sender === "bot"
                      ? (message.avatar ?? avatarUrl ?? undefined)
                      : message.avatar
                  }
                  primaryColor={primaryColor}
                  onCorrect={
                    message.sender === "bot" ? handleCorrect : undefined
                  }
                  onLike={message.sender === "bot" ? handleLike : undefined}
                  onDislike={
                    message.sender === "bot" ? handleDislike : undefined
                  }
                />
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick replies */}
      {predefinedMessages.length > 0 && (
        <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-border/60 px-3 py-2">
          {predefinedMessages.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => handleSend(reply)}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-caption text-foreground transition-colors hover:bg-muted"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 border-t border-border px-3 py-2.5">
        <ChatInput
          placeholder={placeholderMessage}
          primaryColor={primaryColor}
          onSend={handleSend}
        />
      </div>

      {/* Admin actions (only shown when onClose is provided) */}
      {onClose && (
        <div className="flex shrink-0 gap-2 border-t border-border px-3 py-2.5">
          <button
            type="button"
            className="rounded-lg px-3 py-1.5 text-body-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
            onClick={onClose}
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-body-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Clear Chat
          </button>
        </div>
      )}
    </div>
  );
}
