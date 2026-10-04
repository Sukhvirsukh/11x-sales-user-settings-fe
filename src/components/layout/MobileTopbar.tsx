import { Menu, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/Brand";
import { useMobileSidebarStore } from "@/stores/mobileSidebarStore";
import { useTestChatStore } from "@/stores/testChatStore";

export default function MobileTopbar() {
    const open = useMobileSidebarStore((state) => state.open);
    const isChatOpen = useTestChatStore((state) => state.isOpen);
    const toggleChat = useTestChatStore((state) => state.toggle);

    return (
        <div className="fixed inset-x-0 top-0 z-30 border-b border-border bg-sidebar/90 px-4 backdrop-blur md:hidden">
            <div className="flex h-14 w-full items-center justify-between gap-3">
                <BrandLogo markClassName="size-7" />

                <div className="flex shrink-0 items-center gap-2">
                    <Button variant="outline" size="sm" onClick={toggleChat} aria-pressed={isChatOpen}>
                        <MessageSquareText className="size-4" aria-hidden="true" />
                        Test chat
                    </Button>
                    <Button variant="outline" size="icon" className="size-8" aria-label="Open menu" onClick={open}>
                        <Menu className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
