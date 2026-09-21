import { CheckIcon, Pencil, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useState, type PropsWithChildren } from "react";
import {
  ProductRecommendation,
  type ProductRecommendationItem,
} from "./ProductRecommendation";

const messageTextClassName = "whitespace-pre-wrap text-sm leading-5 md:text-base md:leading-6";

function AgentMessage({ content, children }: PropsWithChildren<{ content?: string }>) {
  return (
    <div className="rounded-[10px] border border-control-border-subtle/20 bg-message-bot/18 p-2.5">
      {content && <p className={messageTextClassName}>{content}</p>}
      {children}
    </div>
  )
}

function UserMessage({ content }: { content: string }) {
  return (
    <p className={`${messageTextClassName} rounded-[10px] border border-control-border-subtle/20 bg-message-user/20 p-2.5`}>
      {content}
    </p>
  )
}

interface ChatMessageBase {
  id: string;
  sender: "user" | "bot";
  timestamp?: Date;
  avatar?: string;
}

export interface TextChatMessage extends ChatMessageBase {
  type?: "text";
  content: string;
}

export interface ProductRecommendationChatMessage extends ChatMessageBase {
  type: "product-recommendation";
  sender: "bot";
  content?: string;
  products: ProductRecommendationItem[];
}

export type ChatMessageData = TextChatMessage | ProductRecommendationChatMessage;

export type ChatMessageProps = ChatMessageData & {
  primaryColor?: string;
  onCorrect?: (messageId: string, correctedContent: string) => void;
  onDebug?: (messageId: string) => void;
  onLike?: (messageId: string) => void;
  onDislike?: (messageId: string) => void;
  onApprove?: (messageId: string) => void;
};

function ProductRecommendationMessage({
  content,
  products,
}: Pick<ProductRecommendationChatMessage, "content" | "products">) {
  return (
    <AgentMessage content={content}>
      <div className={content ? "mt-2 space-y-2" : "space-y-2"} aria-label="Product recommendations">
        {products.map((product) => (
          <ProductRecommendation key={product.id} product={product} />
        ))}
      </div>
    </AgentMessage>
  );
}

const actionClassName =
  "text-sm text-content-strong transition-colors hover:text-primary";

export function ChatMessage(props: ChatMessageProps) {
  const {
    id,
    sender,
    primaryColor = "var(--widget-primary)",
    onCorrect,
    onLike,
    onDislike,
    onApprove,
  } = props;
  const content = props.content ?? "";
  const isUser = sender === "user";
  const isProductRecommendation = props.type === "product-recommendation";

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

      <div className={isUser ? "relative max-w-[227px]" : isProductRecommendation ? "relative w-full min-w-0" : "relative w-fit max-w-full min-w-0"}>
        <div>
          {isProductRecommendation ? (
            <ProductRecommendationMessage
              content={props.content}
              products={props.products}
            />
          ) : sender === "bot" ? (
            <AgentMessage content={content} />
          ) : (
            <UserMessage content={content} />
          )}
        </div>

        {/* Feedback row for bot messages */}
        {!isUser && (
          <div className="mt-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
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
                  <span className="flex items-center gap-1">
                    <Pencil size={12} />
                    Create correction
                  </span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-1">
              {onLike && (
                <button
                  type="button"
                  onClick={() => onLike(id)}
                  className="flex items-center justify-center text-content-strong transition-colors hover:text-primary"
                  aria-label="Good response"
                >
                  <ThumbsUpIcon className="size-3.5" />
                </button>
              )}
              {onDislike && (
                <button
                  type="button"
                  onClick={() => onDislike(id)}
                  className="flex items-center justify-center text-content-strong transition-colors hover:text-primary"
                  aria-label="Bad response"
                >
                  <ThumbsDownIcon className="size-3.5" />
                </button>
              )}
              {onApprove && (
                <button
                  type="button"
                  onClick={() => onApprove(id)}
                  className="flex items-center justify-center text-content-strong transition-colors hover:text-primary"
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
          <div className="absolute z-99 mt-1.5 rounded-xl border border-border bg-widget-surface p-2 shadow-sm">
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
                className="rounded-md px-2 py-1 text-micro font-medium text-primary-contrast transition-opacity hover:opacity-90"
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
