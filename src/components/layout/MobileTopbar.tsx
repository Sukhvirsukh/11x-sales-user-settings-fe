import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileSidebarStore } from "@/stores/mobileSidebarStore";
import { useTestChatStore } from "@/stores/testChatStore";
import { StoreDropdown } from "../shared/StoreDropdown";

export default function MobileTopbar() {
    const open = useMobileSidebarStore((state) => state.open);
    const isChatOpen = useTestChatStore((state) => state.isOpen);
    const toggleChat = useTestChatStore((state) => state.toggle);

    return (
        <div className="flex w-full items-center justify-between gap-3 md:hidden">
            <div className="flex min-w-0 items-center gap-2.5">
                <img
                    src="/logo.svg"
                    alt=""
                    className="size-7 shrink-0 object-contain"
                />
                <span className="truncate text-lg font-semibold text-foreground">
                    Vitalb
                </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <Button
                    variant="outline"
                    className="h-auto border-black px-3 py-1.5 text-base rounded-[10px]"
                    onClick={toggleChat}
                    aria-pressed={isChatOpen}
                >
                    Test chat
                </Button>

                <StoreDropdown className="h-auto! w-auto! min-w-0 px-2.5 py-1.5 text-base" />

                <button
                    type="button"
                    aria-label="Open menu"
                    onClick={open}
                    className="flex shrink-0 items-center justify-center rounded-[10px] border border-primary/20 bg-card-nested p-2 text-muted-foreground"
                >
                    <Menu className="size-4" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}
