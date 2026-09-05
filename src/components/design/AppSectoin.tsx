import type { ReactNode } from "react";

export default function AppSection({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <section className={`flex p-2.5 flex-col items-start gap-4 rounded-[10px] border border-section-border bg-section-bg w-full h-full ${className ?? ""}`}>
            {children}
        </section>
    )
}
