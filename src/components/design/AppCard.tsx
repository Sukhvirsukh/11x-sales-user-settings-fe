import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import Heading from "./Heading";

interface AppCardProps {
    children: ReactNode;
    className?: string;
    header?: string;
    actions?: ReactNode;
    padding?: "default" | "sm";
}

export default function AppCard({ children, className, header, actions, padding = "default" }: AppCardProps) {
    return (
        <div
            className={cn(
                "w-full rounded-[10px] border border-section-border bg-white",
                padding === "sm" ? "p-2.5" : "p-2.5 md:p-4",
                className,
            )}
        >
            {(header || actions) && (
                <div className="mb-2.5 flex items-start justify-between gap-4">
                    {header && <Heading size="md">{header}</Heading>}
                    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
