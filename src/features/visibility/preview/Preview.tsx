import { ChatBox } from "@/components/shared/chatBox";
import { useVisibilityForm } from "../VisibilityFormContext";
import { useState, type CSSProperties } from "react";
import { ChatBubbleButton, isBarBubbleType } from "./ChatButton";

type ChatBoxStyle = CSSProperties & Record<
    "--chat-box-bottom" | "--chat-box-max-height" | "--chat-box-mobile-bottom" | "--chat-box-mobile-max-height",
    string
>;

export default function Preview() {
    const { fields } = useVisibilityForm();

    const [isChatOpen, setIsChatOpen] = useState(true);

    const onClose = () => {
        setIsChatOpen(false);
    };

    const size = Number(fields.bubbleSize) || 56;
    const bottom = fields.moveUpDown;
    const edge = fields.moveLeftRight;
    const isBar = isBarBubbleType(fields.chatBubbleType);
    const chatBoxStyle: ChatBoxStyle = {
        zIndex: fields.zIndex + 1,
        "--chat-box-bottom": `calc(${bottom}px + ${size}px + 12px)`,
        "--chat-box-max-height": `calc(100% - ${bottom + size + 12 + 8}px)`,
        "--chat-box-mobile-bottom": `${bottom}px`,
        "--chat-box-mobile-max-height": `calc(100% - ${bottom + 8}px)`,
        ...(fields.position === "left" ? { left: edge } : { right: edge }),
    };

    return (
        <div className="relative isolate min-h-0 min-w-0 flex-1 overflow-hidden">
            {isChatOpen && (
                <div
                    className="absolute z-30 h-[420px] w-[min(100%,300px)] max-h-[var(--chat-box-max-height)] bottom-[var(--chat-box-bottom)] max-sm:h-[560px] max-sm:max-h-[var(--chat-box-mobile-max-height)] max-sm:bottom-[var(--chat-box-mobile-bottom)]"
                    style={chatBoxStyle}
                >
                    <ChatBox
                        fields={fields}
                        onClose={onClose}
                        className="h-full"
                    />
                </div>
            )}

            <div
                className="absolute z-20"
                style={{
                    zIndex: fields.zIndex,
                    bottom: `${bottom}px`,
                    ...(isBar
                        ? {
                            left: 0,
                            right: 0,
                            display: "flex",
                            justifyContent:
                                fields.position === "left"
                                    ? "flex-start"
                                    : "flex-end",
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
