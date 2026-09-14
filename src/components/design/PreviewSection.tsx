import type { ReactNode } from "react";

export default function PreviewSection({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col items-start gap-3.5 pb-5 pt-2">
            <div className="flex w-full flex-col items-start gap-3.5 overflow-hidden rounded-[10px] border border-section-border bg-card-nested p-4 shadow-blue">
                {children}
            </div>
        </div>
    )
}
