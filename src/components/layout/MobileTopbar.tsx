import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileSidebarStore } from "@/stores/mobileSidebarStore";
import { StoreDropdown } from "../shared/StoreDropdown";

export default function MobileTopbar() {
    const open = useMobileSidebarStore((state) => state.open);

    return (
        <div className="flex w-full items-center justify-between gap-3 md:hidden">
            <div className="flex min-w-0 items-center gap-2.5">
                <div className="h-[21px] w-[25px] shrink-0 rounded bg-primary" />
                <span className="truncate text-lg font-semibold text-foreground">
                    Vitalb
                </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <Button
                    variant="outline"
                    className="h-auto border-black px-3 py-1.5 text-base rounded-[10px]"
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
