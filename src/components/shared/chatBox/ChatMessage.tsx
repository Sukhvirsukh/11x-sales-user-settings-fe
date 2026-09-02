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
      {!isUser && avatar && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-border">
          <img
            src={avatar}
            alt="Bot avatar"
            className="h-8 w-8 rounded-full object-cover"
          />
        </div>
      )}

      <div className="min-w-0 max-w-full">
        {/* Message bubble */}
        <div
          className={`w-auto max-w-full rounded-[10px] p-2.5 ${isUser
            ? "bg-chat-bg text-foreground"
            : "bg-chat-bg text-foreground"
            }`}
        >
          <p className="text-base font-medium leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        {/* Feedback row for bot messages */}
        {!isUser && (
          <div className="mt-1 flex items-center justify-between">
            {/* {timestamp && (
              <span className="text-micro text-placeholder">
                {timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )} */}
            {onCorrect && (
              <button
                type="button"
                onClick={() => {
                  setCorrectionDraft(content);
                  setIsEditing(!isEditing);
                }}
                className="flex items-center justify-center rounded text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
                aria-label="Edit correction"
              >
                <PencilIcon className="size-3 mr-1" /> Correction
              </button>
            )}
            <div className="flex items-center gap-1">
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
      {isUser && avatar && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chat-muted">
          <img
            src={avatar}
            alt="User avatar"
            className="h-8 w-8 rounded-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
