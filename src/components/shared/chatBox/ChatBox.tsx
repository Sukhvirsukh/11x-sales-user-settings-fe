import { useEffect, useMemo, useRef, useState } from "react";
import { ChatMessage, type ChatMessageProps } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useChatVisibilityQuery } from "@/features/visibility/visibilityQuery";
import { XIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { VisibilityFields } from "@/components/shared/chatBox/type";
import { Button } from "@/components/ui/button";

interface ChatBoxProps {
  onClose?: () => void;
  className?: string;
  fields?: VisibilityFields;
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

export function ChatBox({ onClose, className = "", fields: previewFields }: ChatBoxProps) {
  const { data: cachedFields, isLoading, error } = useChatVisibilityQuery();
  const fields = previewFields ?? cachedFields;

  if (error) {
    return (
      <div className={`flex h-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[10px] bg-white shadow-xl ${className}`}>
        <Button variant="bare" onClick={onClose}  >
          <XIcon className="size-8 text-red-500" />
        </Button>
        <p className="text-sm text-red-600">Failed to load chat settings.</p>
      </div>
    );
  }

  if (isLoading && !fields) {
    return (
      <div className={`flex h-full items-center justify-center overflow-hidden rounded-[10px] bg-white shadow-xl ${className}`}>
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  if (!fields) {
    return (
      <div className={`flex h-full items-center justify-center overflow-hidden rounded-[10px] bg-white shadow-xl ${className}`}>
        <p className="text-sm text-zinc-400">No chat configuration found.</p>
      </div>
    );
  }

  return <LoadedChatBox fields={fields} onClose={onClose} className={className} />;
}

function LoadedChatBox({ fields, onClose, className = "" }: ChatBoxProps & { fields: VisibilityFields }) {

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
    setMessages((current) => {
      const welcome = current.find((message) => message.id === "welcome");
      if (welcome) {
        return current.map((message) =>
          message.id === "welcome"
            ? { ...message, content: welcomeMessage }
            : message,
        );
      }
      return welcomeMessage ? [createWelcomeMessage(welcomeMessage), ...current] : current;
    });
  }, [welcomeMessage]);

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
    <div className={`flex  h-full flex-col overflow-hidden rounded-[10px] bg-white shadow-xl ${className}`}>
      {/* Header */}
      <div
        className="flex shrink-0 items-center justify-between gap-2 px-5 pb-[15px] pt-[25px]"
        style={{ backgroundColor: `${primaryColor}22` }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="min-w-0 flex items-center gap-2.5">
            <p className="truncate text-base font-semibold tracking-[0.02em]">
              {agentName}
            </p>
            <span className="inline-flex items-center gap-[7px] rounded-[44px] bg-status-online! px-1.5 py-[3px] text-[10px] font-medium tracking-[0.04em] text-success-strong">
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
            className="flex size-5 shrink-0 items-center justify-center text-2xl leading-none text-[#808080] transition-colors hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[18px] py-2.5">
        <div className="space-y-2">
          {messages.length > 0 && (
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
        <div className="min-h-0 max-h-[30%] shrink overflow-y-auto border-t border-border/60 px-4.5 py-2">
          <div className="flex flex-wrap gap-1.5">
            {predefinedMessages.map((reply) => (
              <button
                key={reply}
                type="button"
                title={reply}
                onClick={() => handleSend(reply)}
                className="max-w-full truncate rounded-full border border-border bg-background px-2.5 py-1 text-left text-caption text-foreground transition-colors hover:bg-muted"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom: input + actions */}
      <div className="flex shrink-0 flex-col gap-3 px-[18px] pb-6 pt-0">
        <ChatInput
          placeholder={placeholderMessage}
          primaryColor={primaryColor}
          onSend={handleSend}
        />

        {onClose && (
          <div className="flex gap-2">
            <button
              type="button"
              className="h-[38px] rounded-[10.4px] px-2.5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
              onClick={onClose}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="h-[38px] rounded-[10.4px] border-[1.23px] border-[#808080] bg-card px-2.5 py-2.5 text-sm font-medium text-[#808080] transition-colors hover:bg-muted"
            >
              Clear Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
