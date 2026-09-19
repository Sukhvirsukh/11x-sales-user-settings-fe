import previewBackground from "@/assets/chatSettings/preview-background.png";
import { ChatBox } from "@/components/shared/chatBox";
import { Button } from "@/components/ui/button";
import { useVisibilityForm } from "../VisibilityFormContext";
import { useState, type CSSProperties } from "react";
import { Maximize2, Minimize2, PanelLeft, PanelLeftClose } from "lucide-react";
import { ChatBubbleButton, isBarBubbleType } from "./ChatButton";

type ChatBoxStyle = CSSProperties & Record<
    "--chat-box-bottom" | "--chat-box-max-height" | "--chat-box-mobile-bottom" | "--chat-box-mobile-max-height",
    string
>;

interface PreviewProps {
    isMaximized: boolean;
    onToggleMaximize: () => void;
    isSettingsOpen: boolean;
    onToggleSettings: () => void;
}

export default function Preview({
    isMaximized,
    onToggleMaximize,
    isSettingsOpen,
    onToggleSettings,
}: PreviewProps) {
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
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <header className="flex shrink-0 items-center justify-between px-3 pt-3.5 pb-2 md:px-5 md:pt-5 md:pb-2">
                <h2 className="text-lg font-semibold text-foreground">
                    Preview
                </h2>

                <div className="flex items-center gap-0.5">
                    <Button
                        variant="bare"
                        size="sm"
                        className="md:hidden"
                        aria-label={isSettingsOpen ? "Hide settings" : "Show settings"}
                        aria-expanded={isSettingsOpen}
                        onClick={onToggleSettings}
                    >
                        {isSettingsOpen ? (
                            <PanelLeftClose className="size-4" />
                        ) : (
                            <PanelLeft className="size-4" />
                        )}
                    </Button>

                    <Button
                        variant="bare"
                        size="sm"
                        aria-label={isMaximized ? "Minimize preview" : "Maximize preview"}
                        aria-pressed={isMaximized}
                        onClick={onToggleMaximize}
                    >
                        {isMaximized ? (
                            <Minimize2 className="size-4" />
                        ) : (
                            <Maximize2 className="size-4" />
                        )}
                    </Button>
                </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-2.5 md:px-5 md:pb-5">
                <div className="relative isolate w-full flex-1 overflow-hidden bg-preview-canvas-background">
                    <img
                        src={previewBackground}
                        alt=""
                        aria-hidden
                        className="pointer-events-none absolute inset-0 h-full w-full scale-[1.01] object-cover object-top brightness-70 blur-[1.5px]"
                    />

                    {isChatOpen && (
                        <div
                            className="absolute z-30 h-105 w-[min(100%,410px)] max-h-[var(--chat-box-max-height)] bottom-[var(--chat-box-bottom)] max-sm:h-[560px] max-sm:max-h-[var(--chat-box-mobile-max-height)] max-sm:bottom-[var(--chat-box-mobile-bottom)]"
                            style={chatBoxStyle}
                        >
                            <ChatBox
                                fields={fields}
                                onClose={onClose}
                                className="h-full"
                                defaultMessages={[
                                    {
                                        id: "welcome",
                                        content: "Welcome to Karl ai shop, how can I help you",
                                        sender: "bot",
                                        timestamp: new Date(),
                                    },
                                    {
                                        id: "user",
                                        content: "Do you have shoe in black?",
                                        sender: "user",
                                        timestamp: new Date(),
                                    },
                                    {
                                        id: "product-recommendations",
                                        type: "product-recommendation",
                                        content: "Yes, absolutely!\nPlease check",
                                        sender: "bot",
                                        timestamp: new Date(),
                                        products: [
                                            {
                                                id: "navy-black-shoe",
                                                title: "Navy Black Shoe",
                                                code: "9889",
                                                price: "₹ 4000",
                                            },
                                        ],
                                    }
                                ]}
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
            </div>
        </div>
    );
}
