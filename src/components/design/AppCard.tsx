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
                "w-full rounded-[10px] border border-section-border bg-white",
                padding === "sm" ? "p-2.5" : "p-2.5 md:p-4",
                shadow && "shadow-blue",
                className,
            )}
        >
            {(header || actions) && (
                <div className="mb-2.5 flex items-center     justify-between gap-4">
                    {header && <Heading size={headingSize}>{header}</Heading>}
                    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
