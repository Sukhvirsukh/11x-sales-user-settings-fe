import { useEffect } from "react";
import { X } from "lucide-react";
import { BrandLogo } from "@/components/brand/Brand";
import { StoreDropdown } from "@/components/shared/StoreDropdown";
import SidebarNav from "./SidebarNav";
import SidebarUserCard from "./SidebarUserCard";
import { useMobileSidebarStore } from "@/stores/mobileSidebarStore";
import { useAuthStore } from "@/features/auth";

const MD_BREAKPOINT = 768;

export default function MobileSidebar() {
    const isOpen = useMobileSidebarStore((state) => state.isOpen);
    const close = useMobileSidebarStore((state) => state.close);
    const name = useAuthStore((state) => state.name);
    const email = useAuthStore((state) => state.email);

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

    return (
        <div
            className={`fixed inset-0 z-50 md:hidden ${isOpen ? "" : "pointer-events-none"}`}
            role="dialog"
            aria-modal="true"
            aria-hidden={!isOpen}
            inert={!isOpen}
        >
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
                    isOpen ? "opacity-100" : "opacity-0"
                }`}
            />

            {/* Panel — stays mounted so it can slide in from the left edge. */}
            <aside
                className={`absolute inset-y-0 left-0 flex h-full w-full max-w-[300px] flex-col border-r border-border bg-sidebar shadow-[var(--elevation-2)] transition-transform duration-300 ease-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-14 items-center justify-between px-4">
                    <BrandLogo />
                    <button
                        type="button"
                        onClick={close}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-control-hover hover:text-foreground"
                        aria-label="Close menu"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="px-3 pb-4">
                    <p className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Store</p>
                    <StoreDropdown variant="sidebar" />
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
                    <SidebarNav onNavigate={close} />
                </div>

                <div className="border-t border-border p-3">
                    <SidebarUserCard name={name ?? "Account"} email={email ?? ""} />
                </div>
            </aside>
        </div>
    );
}
