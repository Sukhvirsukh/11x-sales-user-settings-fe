import { useEffect } from "react";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { NAV_ITEMS } from "./sideNav";
import SidebarUserCard from "./SidebarUserCard";
import { useMobileSidebarStore } from "@/stores/mobileSidebarStore";

const MD_BREAKPOINT = 768;

export default function MobileSidebar() {
    const isOpen = useMobileSidebarStore((state) => state.isOpen);
    const close = useMobileSidebarStore((state) => state.close);
    const navigate = useNavigate();
    const location = useLocation();

    // Close when switching to desktop widths
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= MD_BREAKPOINT) close();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [close]);

    // Lock body scroll while open
    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Panel */}
            <aside className="absolute inset-y-0 left-0 flex h-full w-full max-w-[320px] flex-col bg-white p-2.5 shadow-blue sm:max-w-[360px] sm:p-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border-light pb-2.5 sm:pb-4">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className="size-5 shrink-0 rounded-md bg-primary sm:size-8 sm:rounded-lg" />
                        <span className="truncate text-lg font-semibold text-foreground">
                            Vitalb
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={close}
                        className="rounded-[10px] p-2 text-muted-foreground hover:bg-muted"
                        aria-label="Close menu"
                    >
                        <X className="size-5 sm:size-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto py-2.5 sm:space-y-1.5 sm:py-4">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.link;
                        return (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => {
                                    navigate(item.link);
                                    close();
                                }}
                                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-base font-medium transition-colors sm:gap-3 sm:px-3 sm:py-2.5 ${
                                    isActive
                                        ? "border border-blue-100/80 bg-blue-50/60 text-foreground shadow-2xs"
                                        : "border border-transparent text-foreground hover:bg-blue-50/60"
                                }`}
                            >
                                <Icon
                                    className={`size-4 shrink-0 sm:size-5 ${
                                        isActive ? "text-primary" : "text-foreground"
                                    }`}
                                />
                                <span className="truncate">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Profile */}
                <div className="pt-2.5 sm:pt-4">
                    <SidebarUserCard
                        name="Racheal karl"
                        email="Alex@co.com"
                        isCollapsed={false}
                    />
                </div>
            </aside>
        </div>
    );
}
