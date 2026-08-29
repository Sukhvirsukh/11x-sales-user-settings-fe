import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "./sidebarStore";

export function SidebarMenuButton() {
  const openMobile = useSidebarStore((state) => state.openMobile);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="mt-0.5 shrink-0 md:hidden"
      aria-label="Open navigation"
      onClick={openMobile}
    >
      <Menu />
    </Button>
  );
}
