import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PreviewSectionProps {
    children: ReactNode;
    className?: string;
    contentClassName?: string;
}

export default function PreviewSection({ children, className, contentClassName }: PreviewSectionProps) {
    return (
        <div className={cn("flex flex-col items-start gap-3.5 pb-5 pt-2", className)}>
            <div className={cn(
                "flex w-full flex-col items-start gap-3.5 overflow-hidden rounded-[10px] border border-section-border bg-preview-section-background p-4 shadow-blue",
                contentClassName,
            )}>
                {children}
            </div>
        </div>
    )
}
