import { useState } from "react";
import previewBackground from "@/assets/chatSettings/preview-background.png";
import { useVisibilityStore } from "@/pages/chatSettings/store/chatVisibilityStore";
import { ChatBubbleButton, isBarBubbleType } from "./ChatBubbleButtons";
import { PreviewChatPanel } from "./PreviewChatPanel";

export function Preview() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const fields = useVisibilityStore((s) => s.fields);

  const size = Number(fields.bubbleSize) || 56;
  const isBar = isBarBubbleType(fields.chatBubbleType);
  const edge = `${fields.moveLeftRight}px`;
  const bottom = `${fields.moveUpDown}px`;

  return (
    <div className="relative h-full min-h-[240px] w-full overflow-hidden rounded-[8px] border border-border bg-white">
      <img
        src={previewBackground}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-30"
      />

      {isChatOpen && (
        <div
          className="absolute z-30"
          style={{
            zIndex: fields.zIndex + 1,
            bottom: `calc(${bottom} + ${size}px + 12px)`,
            maxHeight: `calc(100% - ${fields.moveUpDown + size + 12 + 8}px)`,
            ...(fields.position === "left"
              ? { left: edge }
              : { right: edge }),
          }}
        >
          <PreviewChatPanel
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      )}

      <div
        className="absolute z-20"
        style={{
          zIndex: fields.zIndex,
          bottom,
          ...(isBar
            ? {
                left: 0,
                right: 0,
                display: "flex",
                justifyContent:
                  fields.position === "left" ? "flex-start" : "flex-end",
                paddingLeft: edge,
                paddingRight: edge,
              }
            : fields.position === "left"
              ? { left: edge }
              : { right: edge }),
        }}
      >
        <ChatBubbleButton
          type={fields.chatBubbleType}
          primaryColor={fields.primaryColor}
          placeholder={fields.placeholderMessage}
          size={size}
          aria-expanded={isChatOpen}
          onClick={() => setIsChatOpen((open) => !open)}
        />
      </div>
    </div>
  );
}
