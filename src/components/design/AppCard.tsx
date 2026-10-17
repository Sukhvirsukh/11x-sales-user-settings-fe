import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import Heading from "./Heading";

interface AppCardProps {
    children: ReactNode;
    className?: string;
    header?: string;
    headingSize?: "lg" | "md";
    actions?: ReactNode;
    padding?: "default" | "sm";
    shadow?: boolean;
}

export default function AppCard({ children, className, header, headingSize = "md", actions, padding = "default", shadow = false }: AppCardProps) {
    return (
        <div
            className={cn(
                "w-full rounded-xl border border-section-border bg-app-card-background",
                // Inside a section panel a card becomes a quiet tile rather than a box in a box.
                "in-data-[slot=app-section]:rounded-lg in-data-[slot=app-section]:border-border-subtle in-data-[slot=app-section]:bg-surface-subtle in-data-[slot=app-section]:shadow-none",
                padding === "sm" ? "p-3" : "p-3 md:p-4",
                shadow ? "shadow-panel" : "",
                className,
            )}
        >
            {(header || actions) && (
                <div className="mb-3 flex items-center justify-between gap-4">
                    {header && <Heading size={headingSize}>{header}</Heading>}
                    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
