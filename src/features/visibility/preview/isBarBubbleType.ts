import type { ChatBubbleType } from "@/components/design/ChatBubbleTypeSelector";

export function isBarBubbleType(type: ChatBubbleType) {
    return type === "type-bar" || type === "classic-bar" || type === "custom";
}
