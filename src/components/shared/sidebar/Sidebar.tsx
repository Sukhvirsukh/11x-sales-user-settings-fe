import { useEffect } from "react";
import {
  LayoutGrid,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Sparkles,
  LifeBuoy,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import type { ReactNode } from "react";
import { useLocation, Link } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarUserCard } from "./SidebarUserCard";
import { useSidebarStore } from "./sidebarStore";
import { isSidebarHidden } from "./isSidebarHidden";

interface NavItem {
  icon: ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutGrid className="h-[14px] w-[14px]" />, label: "Overview", href: "/" },
  { icon: <Users className="h-[14px] w-[14px]" />, label: "Contacts", href: "/contacts" },
  { icon: <MessageSquare className="h-[14px] w-[14px]" />, label: "Conversations", href: "/conversations" },
  { icon: <BarChart3 className="h-[14px] w-[14px]" />, label: "Reports", href: "/reports" },
  { icon: <Settings className="h-[14px] w-[14px]" />, label: "Chat settings", href: "/chat-settings" },
  { icon: <Sparkles className="h-[14px] w-[14px]" />, label: "AI training", href: "/ai-training" },
  { icon: <LifeBuoy className="h-[14px] w-[14px]" />, label: "Help & support", href: "/help" },
  { icon: <MessageCircle className="h-[14px] w-[14px]" />, label: "Ask me anything", href: "/ask" },
];

export function Sidebar() {
  const location = useLocation();
  const isMobileOpen = useSidebarStore((state) => state.isMobileOpen);
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const closeMobile = useSidebarStore((state) => state.closeMobile);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMobile();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileOpen, closeMobile]);

  if (isSidebarHidden(location.pathname)) {
    return null;
  }

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          aria-label="Close navigation"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "relative flex h-full shrink-0 flex-col overflow-hidden rounded-[8px] bg-sidebar text-sidebar-foreground transition-[width,transform] duration-200",
          "fixed inset-y-[12px] left-[12px] z-50 w-[200px] md:static md:inset-auto md:left-auto md:z-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+24px)] md:translate-x-0",
          isCollapsed ? "md:w-16 lg:w-[200px]" : "md:w-[200px]",
        )}
      >
        <div
          className={cn(
            "mt-[28px] flex gap-[8px] px-[14px]",
            isCollapsed ? "md:flex-col md:items-center lg:flex-row lg:items-center" : "items-center",
          )}
        >
          <div className="flex h-[20px] w-[23px] shrink-0 items-center justify-center rounded-[4px] bg-primary text-micro font-semibold leading-none text-primary-foreground">
            V
          </div>
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-body-sm font-semibold leading-none text-foreground",
              isCollapsed && "md:hidden lg:inline",
            )}
          >
            Vitalb
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="hidden shrink-0 md:inline-flex lg:hidden"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={toggleCollapsed}
          >
            {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
        </div>

        <nav className={cn("mt-[43px] px-[14px]", isCollapsed && "md:px-2 lg:px-[14px]")}>
          <ul className="flex flex-col gap-[1px]">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  title={item.label}
                  className={cn(
                    "flex items-center gap-[11px] rounded-[8px] py-[10px] px-[9px] text-body font-normal leading-none transition-colors",
                    isCollapsed && "md:justify-center md:gap-0 lg:justify-start lg:gap-[11px]",
                    isActive(item.href)
                      ? "border border-sidebar-border bg-card text-foreground"
                      : "text-sidebar-foreground hover:bg-card/55",
                  )}
                >
                  {item.icon}
                  <span className={cn(isCollapsed && "md:hidden lg:inline")}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <SidebarUserCard
          name="Racheal karl"
          email="Alex@jco.com"
          collapsed={isCollapsed}
        />
      </aside>
    </>
  );
}
