import { useState, type ReactNode } from "react";
import { useNavigate, type NavigateProps } from "react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreDropdown } from "./StoreDropdown";
import { ChatBox } from "@/components/shared/chatBox";

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
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <div className="flex h-full flex-col">
            <header className="mb-2 md:mb-6 flex flex-col gap-4 py-2.5 md:flex-row md:items-start md:justify-between">
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
                        <h1 className="mb-1 text-2xl font-semibold tracking-[2%] md:text-3xl">
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
                        onClick={() => setIsChatOpen((open) => !open)}
                        aria-pressed={isChatOpen}
                    >
                        Test chat
                    </Button>

                    <StoreDropdown />
                </div>
            </header>

            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4 lg:flex-row">
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                    {children}
                </div>

                {isChatOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
                            aria-label="Close test chat"
                            onClick={() => setIsChatOpen(false)}
                        />

                        <div className="fixed inset-x-3 bottom-3 top-3 z-50 overflow-hidden bg-card shadow-lg lg:relative lg:inset-auto lg:z-30 lg:w-[min(360px,38%)] lg:max-w-100 lg:shrink-0 lg:self-stretch">
                            <ChatBox
                                onClose={() => setIsChatOpen(false)}
                                className="h-full"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
