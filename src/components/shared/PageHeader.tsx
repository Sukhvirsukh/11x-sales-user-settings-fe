import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useNavigate, type NavigateProps } from "react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreDropdown } from "./StoreDropdown";
import { ChatBox } from "@/components/shared/chatBox";
import { useTestChatStore } from "@/stores/testChatStore";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backTo?: string | NavigateProps;
    children: ReactNode;
}

export function PageHeader({
    title,
    subtitle,
    backTo,
    children,
}: PageHeaderProps) {
    const navigate = useNavigate();
    const isChatOpen = useTestChatStore((state) => state.isOpen);
    const toggleChat = useTestChatStore((state) => state.toggle);
    const closeChat = useTestChatStore((state) => state.close);
    const chatColumnRef = useRef<HTMLDivElement>(null);
    const [chatPosition, setChatPosition] = useState({ left: 0, width: 360 });

    useLayoutEffect(() => {
        const column = chatColumnRef.current;
        if (!isChatOpen || !column) return;

        const updatePosition = () => {
            const { left, width } = column.getBoundingClientRect();
            setChatPosition({ left, width });
        };

        updatePosition();
        const observer = new ResizeObserver(updatePosition);
        observer.observe(column);
        window.addEventListener("resize", updatePosition);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updatePosition);
        };
    }, [isChatOpen]);

    return (
        <div className="flex h-full flex-col">
            <header className="mb-2.5 md:mb-6 flex flex-col gap-4 py-2.5 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    {backTo && (
                        <Button
                            variant="outline"
                            className="h-8 w-8 shrink-0 rounded-full"
                            onClick={() =>
                                navigate(
                                    typeof backTo === "string" ? backTo : backTo.to
                                )
                            }
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    )}

                    <div className="min-w-0">
                        <h1 className="mb-1.5 text-[22px] font-semibold tracking-[2%] md:text-3xl">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-sm md:text-base">{subtitle}</p>
                        )}
                    </div>
                </div>

                <div className="hidden w-full flex-wrap items-center gap-2.5 md:mt-1 md:flex md:w-auto md:shrink-0">
                    <Button
                        variant="outline"
                        onClick={toggleChat}
                        aria-pressed={isChatOpen}
                    >
                        Test chat
                    </Button>

                    <StoreDropdown />
                </div>
            </header>

            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4 min-[1400px]:flex-row">
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                    {children}
                </div>

                {isChatOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-content-strong/40 backdrop-blur-xs lg:hidden"
                            aria-label="Close test chat"
                            onClick={closeChat}
                        />

                        {/* Reserve space only on very large screens. */}
                        <div
                            ref={chatColumnRef}
                            aria-hidden="true"
                            className="hidden min-[1400px]:block min-[1400px]:w-[min(410px,38%)] min-[1400px]:shrink-0"
                        />
                        <div
                            style={{
                                "--chat-left": `${chatPosition.left}px`,
                                "--chat-width": `${chatPosition.width}px`,
                            } as CSSProperties}
                            className="fixed inset-x-3 bottom-3 top-3 z-50 rounded-[10px] border border-border bg-card shadow-lg max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-auto max-sm:h-[80dvh] max-sm:max-h-[calc(100dvh-1rem)] max-sm:animate-in max-sm:slide-in-from-bottom max-sm:rounded-b-none max-sm:border-0 max-sm:bg-transparent max-sm:duration-300 motion-reduce:animate-none lg:inset-x-auto lg:top-auto lg:right-5 lg:bottom-7 lg:h-[min(600px,calc(100dvh-90px))] lg:w-[410px] min-[1400px]:left-(--chat-left) min-[1400px]:right-auto min-[1400px]:z-30 min-[1400px]:w-(--chat-width)"
                        >
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute left-1/2 top-0 z-[-1] hidden h-20 w-[90%] -translate-x-1/2 rounded-t-[20px] bg-primary max-sm:block"
                            />

                            <div className="h-full min-h-0 max-sm:mt-2 max-sm:overflow-hidden max-sm:rounded-t-[10px] max-sm:bg-popover">
                                <ChatBox
                                    onClose={closeChat}
                                    className="h-full max-sm:rounded-b-none"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
