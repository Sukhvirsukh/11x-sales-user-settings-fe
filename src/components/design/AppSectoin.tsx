import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function AppSection({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <section className={cn(
            "flex h-full w-full flex-col items-start gap-4 rounded-[10px] border border-section-border bg-section-bg p-2.5",
            className,
        )}>
            {children}
        </section>
    )
}
