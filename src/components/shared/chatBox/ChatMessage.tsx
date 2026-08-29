export interface ChatMessageProps {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp?: Date;
  avatar?: string;
}

export function ChatMessage({
  content,
  sender,
  timestamp,
  avatar,
}: ChatMessageProps) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} gap-3`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-border">
          {avatar ? (
            <img
              src={avatar}
              alt="Bot avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          )}
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-chat-muted text-foreground"
            : "bg-card text-foreground shadow-sm"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <p
            className={`mt-1 text-xs ${
              isUser ? "text-chat-foreground" : "text-placeholder"
            }`}
          >
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chat-muted">
          {avatar ? (
            <img
              src={avatar}
              alt="User avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <svg
              className="h-4 w-4 text-chat-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
