import { type CSSProperties } from "react";
import { ChatBox } from "@/components/shared/chatBox";
import { cn } from "@/lib/utils";

interface PreviewChatPanelProps {
  onClose: () => void;
  className?: string;
  style?: CSSProperties;
}

export function PreviewChatPanel({
  onClose,
  className,
  style,
}: PreviewChatPanelProps) {
  return (
    <div
      className={cn(
        "w-[min(100%,300px)]",
        className,
      )}
      style={{ height: "100%", maxHeight: 420, ...style }}
    >
      <ChatBox onClose={onClose} className="h-full" />
    </div>
  );
}
