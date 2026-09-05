import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AppCardProps {
    children: ReactNode;
    className?: string;
}

export default function AppCard({ children, className }: AppCardProps) {
    return (
        <div
            className={cn("rounded-[10px] bg-white p-2.5 md:p-4", className)}
        >
            {children}
        </div>
    );
}

