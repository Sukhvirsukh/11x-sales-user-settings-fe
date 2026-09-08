import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./DetailContainer.module.css";

interface DetailContainerProps {
    children: ReactNode;
    fullWidth?: boolean;
    /** Give desktop detail groups equal columns instead of sizing to content. */
    equalWidth?: boolean;
    leading?: ReactNode;
    actions?: ReactNode;
    className?: string;
}

export function DetailItem({ label, value, labelWidth }: {
    label: string;
    value: ReactNode;
    labelWidth?: string;
}) {
    return (
        <div className="w-full min-w-0">
            <p className={cn("mb-2.5 text-sm text-gray", labelWidth)}>{label}</p>
            <div className="break-words text-base">{value}</div>
        </div>
    );
}

export function DetailGroup({ children, className }: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn(styles.group, className)}>
            {children}
        </div>
    );
}

export default function DetailContainer({
    children,
    fullWidth = false,
    equalWidth = false,
    leading,
    actions,
    className,
}: DetailContainerProps) {
    const hasHeader = leading != null || actions != null;

    return (
        <div className={cn(styles.container, className)} data-full-width={fullWidth} data-equal-width={equalWidth}>
            {leading != null && <div className="shrink-0 self-start">{leading}</div>}
            <div className={cn(styles.details, hasHeader && styles.withHeader)}>
                {children}
            </div>
            {actions != null && <div className={styles.actions}>{actions}</div>}
        </div>
    );
}
