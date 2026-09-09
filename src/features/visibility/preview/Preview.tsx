import previewBackground from "@/assets/chatSettings/preview-background.png";
import { ChatBox } from "@/components/shared/chatBox";
import { useVisibilityForm } from "../VisibilityFormContext";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, PanelLeft, PanelLeftClose } from "lucide-react";
import { useState } from "react";
import { ChatBubbleButton, isBarBubbleType } from "./ChatButton";

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

    return (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex shrink-0 items-center justify-between border-b border-border px-3 pt-2.5 pb-1.5 md:px-5 md:pb-2.5">
                <h2 className="text-title py-2.5 font-semibold text-foreground">
                    Preview
                </h2>

                <div className="flex items-center gap-0.5">
                    <Button
                        variant="bare"
                        size="sm"
                        className="md:hidden"
                        aria-label={
                            isSettingsOpen ? "Hide settings" : "Show settings"
                        }
                        aria-expanded={isSettingsOpen}
                        onClick={onToggleSettings}
                    >
                        {isSettingsOpen ? (
                            <PanelLeftClose className="h-4 w-4" />
                        ) : (
                            <PanelLeft className="h-4 w-4" />
                        )}
                    </Button>

                    <Button
                        variant="bare"
                        size="sm"
                        aria-label={
                            isMaximized ? "Minimize preview" : "Expand preview"
                        }
                        onClick={onToggleMaximize}
                    >
                        {isMaximized ? (
                            <Minimize2 className="h-4 w-4" />
                        ) : (
                            <Maximize2 className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-2.5 md:px-5 md:pb-5">
                <div className="relative isolate w-full flex-1 overflow-hidden bg-[#E9E9E9]">
                    <img
                        src={previewBackground}
                        alt=""
                        aria-hidden
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply opacity-20"
                    />
                    {isChatOpen && (
                        <div
                            className="absolute z-30 h-[420px] w-[min(100%,300px)]"
                            style={{
                                zIndex: fields.zIndex + 1,
                                bottom: `calc(${bottom}px + ${size}px + 12px)`,
                                maxHeight: `calc(100% - ${bottom + size + 12 + 8}px)`,
                                ...(fields.position === "left"
                                    ? { left: edge }
                                    : { right: edge }),
                            }}
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
            </div>
        </div>
    );
}
