import { useState } from "react";
import { PencilIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

export interface ChatMessageProps {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp?: Date;
  avatar?: string;
  primaryColor?: string;
  onCorrect?: (messageId: string, correctedContent: string) => void;
  onLike?: (messageId: string) => void;
  onDislike?: (messageId: string) => void;
}

export function ChatMessage({
  id,
  content,
  sender,
  timestamp,
  avatar,
  primaryColor = "blue",
  onCorrect,
  onLike,
  onDislike,
}: ChatMessageProps) {
  const isUser = sender === "user";

  const [isEditing, setIsEditing] = useState(false);
  const [correctionDraft, setCorrectionDraft] = useState(content);

  function handleSaveCorrection() {
    onCorrect?.(id, correctionDraft);
    setIsEditing(false);
  }

  function handleCancelCorrection() {
    setCorrectionDraft(content);
    setIsEditing(false);
  }

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

      <div className="min-w-0 max-w-full">
        {/* Message bubble */}
        <div
          className={`w-auto max-w-full rounded-lg p-2 ${isUser
            ? "bg-chat-muted text-foreground"
            : "bg-card text-foreground shadow-sm"
            }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        {/* Feedback row for bot messages */}
        {!isUser && (
          <div className="mt-1 flex items-center gap-2 pl-1">
            {timestamp && (
              <span className="text-micro text-placeholder">
                {timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            {onCorrect && (
              <button
                type="button"
                onClick={() => {
                  setCorrectionDraft(content);
                  setIsEditing(!isEditing);
                }}
                className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
                aria-label="Edit correction"
              >
                <PencilIcon className="size-3" />
              </button>
            )}
            {onLike && (
              <button
                type="button"
                onClick={() => onLike(id)}
                className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-black/5 hover:text-success-strong"
                aria-label="Good response"
              >
                <ThumbsUpIcon className="size-3.5" />
              </button>
            )}
            {onDislike && (
              <button
                type="button"
                onClick={() => onDislike(id)}
                className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-black/5 hover:text-destructive"
                aria-label="Bad response"
              >
                <ThumbsDownIcon className="size-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Feedback row for user messages */}
        {isUser && (
          <div className="mt-1 flex items-center justify-end gap-2 pr-1">
            {timestamp && (
              <span className="text-micro text-chat-foreground">
                {timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        )}

        {/* Correction editor */}
        {isEditing && (
          <div className="mt-1.5 rounded-xl border border-border bg-white p-2 shadow-sm">
            <textarea
              value={correctionDraft}
              onChange={(e) => setCorrectionDraft(e.target.value)}
              rows={2}
              placeholder="Write the correct response..."
              className="w-full resize-none bg-transparent text-body-sm text-foreground outline-none placeholder:text-placeholder"
            />
            <div className="mt-1.5 flex justify-end gap-1.5">
              <button
                type="button"
                onClick={handleCancelCorrection}
                className="rounded-md px-2 py-1 text-micro font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCorrection}
                className="rounded-md px-2 py-1 text-micro font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Save correction
              </button>
            </div>
          </div>
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
