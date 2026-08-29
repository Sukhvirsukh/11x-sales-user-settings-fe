import { Menu } from "lucide-react";
import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "./sidebarStore";
import { isSidebarHidden } from "./isSidebarHidden";

export function SidebarMenuButton() {
  const openMobile = useSidebarStore((state) => state.openMobile);
  const pathname = useLocation().pathname;

  if (isSidebarHidden(pathname)) {
    return null;
  }

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
