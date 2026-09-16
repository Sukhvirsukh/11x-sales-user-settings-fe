import { CheckIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useState } from "react";

export interface ChatMessageProps {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp?: Date;
  avatar?: string;
  primaryColor?: string;
  onCorrect?: (messageId: string, correctedContent: string) => void;
  onDebug?: (messageId: string) => void;
  onLike?: (messageId: string) => void;
  onDislike?: (messageId: string) => void;
  onApprove?: (messageId: string) => void;
}

const actionClassName =
  "text-sm text-black transition-colors hover:text-primary";

export function ChatMessage({
  id,
  content,
  sender,
  avatar,
  primaryColor = "blue",
  onCorrect,
  onDebug,
  onLike,
  onDislike,
  onApprove,
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
    <div className={`flex w-full items-start gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Bot avatar */}
      {!isUser &&
        (avatar ? (
          <img src={avatar} alt="" className="size-5 shrink-0 rounded-[6px] object-cover" />
        ) : (
          <span aria-hidden className="size-5 shrink-0 rounded-[6px] rounded-bl-none bg-primary" />
        ))}

      <div className={isUser ? "max-w-[227px]" : "w-fit max-w-full min-w-0"}>
        {/* Message bubble */}
        <div
          className={`max-w-full rounded-[10px] p-2.5 ${isUser ? "bg-[#E2E2E2]" : "bg-[#EEE]"}`}
        >
          <p className="text-sm leading-none whitespace-pre-wrap text-black">{content}</p>
        </div>

        {/* Feedback row for bot messages */}
        {!isUser && (
          <div className="mt-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {onDebug && (
                <button
                  type="button"
                  onClick={() => onDebug(id)}
                  className={actionClassName}
                  aria-label="Debug response"
                >
                  Debug
                </button>
              )}
              {onCorrect && (
                <button
                  type="button"
                  onClick={() => {
                    setCorrectionDraft(content);
                    setIsEditing(!isEditing);
                  }}
                  className={actionClassName}
                  aria-label="Make correction"
                >
                  Make correction
                </button>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              {onLike && (
                <button
                  type="button"
                  onClick={() => onLike(id)}
                  className="flex items-center justify-center text-black transition-colors hover:text-primary"
                  aria-label="Good response"
                >
                  <ThumbsUpIcon className="size-3.5" />
                </button>
              )}
              {onDislike && (
                <button
                  type="button"
                  onClick={() => onDislike(id)}
                  className="flex items-center justify-center text-black transition-colors hover:text-primary"
                  aria-label="Bad response"
                >
                  <ThumbsDownIcon className="size-3.5" />
                </button>
              )}
              {onApprove && (
                <button
                  type="button"
                  onClick={() => onApprove(id)}
                  className="flex items-center justify-center text-black transition-colors hover:text-primary"
                  aria-label="Approve response"
                >
                  <CheckIcon className="size-4" />
                </button>
              )}
            </div>
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
    </div>
  );
}
