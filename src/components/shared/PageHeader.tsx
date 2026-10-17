import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useNavigate, type NavigateProps } from "react-router";
import { ChevronLeft, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
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
            <header className="mb-5 flex flex-col gap-4 md:mb-6 md:flex-row md:items-end md:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                    {backTo && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="mt-0.5 size-8 shrink-0 rounded-full"
                            aria-label="Back"
                            onClick={() =>
                                navigate(
                                    typeof backTo === "string" ? backTo : backTo.to
                                )
                            }
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                    )}

                    <div className="min-w-0">
                        <h1 className="font-display text-[22px] leading-8 font-semibold tracking-[-0.02em] text-foreground md:text-[26px] md:leading-9">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-1 max-w-2xl text-base text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                </div>

                <div className="hidden shrink-0 items-center gap-2 md:flex">
                    <Button
                        variant="outline"
                        onClick={toggleChat}
                        aria-pressed={isChatOpen}
                        className={isChatOpen ? "border-foreground" : undefined}
                    >
                        <MessageSquareText className="size-4" aria-hidden="true" />
                        Test chat
                    </Button>
                </div>
            </header>

            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4 min-[1680px]:flex-row">
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                    {children}
                </div>

                {isChatOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
                            aria-label="Close test chat"
                            onClick={closeChat}
                        />

                        {/* Reserve space only on very large screens. */}
                        <div
                            ref={chatColumnRef}
                            aria-hidden="true"
                            className="hidden min-[1680px]:block min-[1680px]:w-[min(410px,38%)] min-[1680px]:shrink-0"
                        />
                        <div
                            style={{
                                "--chat-left": `${chatPosition.left}px`,
                                "--chat-width": `${chatPosition.width}px`,
                            } as CSSProperties}
                            className="fixed inset-x-3 bottom-3 top-3 z-50 rounded-xl border border-border bg-card shadow-[var(--elevation-2)] max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-auto max-sm:h-[80dvh] max-sm:max-h-[calc(100dvh-1rem)] max-sm:animate-in max-sm:slide-in-from-bottom max-sm:rounded-b-none max-sm:border-0 max-sm:bg-transparent max-sm:duration-300 motion-reduce:animate-none lg:inset-x-auto lg:top-auto lg:right-5 lg:bottom-7 lg:h-[min(600px,calc(100dvh-90px))] lg:w-[410px] min-[1680px]:left-(--chat-left) min-[1680px]:right-auto min-[1680px]:z-30 min-[1680px]:w-(--chat-width)"
                        >
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute left-1/2 top-0 z-[-1] hidden h-20 w-[90%] -translate-x-1/2 rounded-t-[20px] bg-brand max-sm:block"
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
