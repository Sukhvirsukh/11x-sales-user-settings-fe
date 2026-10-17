import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A white panel on the page canvas. Cards placed inside it render as soft inner tiles. */
export default function AppSection({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <section
            data-slot="app-section"
            className={cn(
                "flex h-full w-full flex-col items-start gap-4 rounded-xl border border-section-border bg-app-section-background p-4 shadow-panel md:p-5",
                className,
            )}
        >
            {children}
        </section>
    )
}
