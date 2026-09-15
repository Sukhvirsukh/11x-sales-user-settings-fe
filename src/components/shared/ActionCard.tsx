import { memo, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ActionCardProps {
    title: string;
    subtitle?: string;
    badge?: ReactNode;
    icon?: ReactNode;
    actions?: ReactNode;
    className?: string;
    variant?: "default" | "bare";
}

function ActionCard({
    title,
    subtitle,
    badge,
    icon,
    actions,
    className,
    variant = "default",
}: ActionCardProps) {
    return (
        <div
            className={cn(
                "flex gap-3",
                variant === "default" && "rounded-[10px] bg-white p-2.5 md:p-4",
                variant === "bare" && "rounded-none border-0 bg-transparent p-0",
                className
            )}
        >
            {icon ? <div className="shrink-0 self-start">{icon}</div> : null}

            <div className="flex min-w-0 flex-1 flex-col gap-2.5 md:flex-row md:items-center md:justify-between md:gap-4">
                <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <p className={`truncate text-base font-medium text-foreground ${badge ? "mb-1.5" : ""}`}>
                            {title}
                        </p>
                        {badge}
                    </div>
                    {subtitle ? (
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    ) : null}
                </div>

                {actions ? (
                    <div className="flex shrink-0 flex-wrap items-center gap-2 self-start md:self-auto">
                        {actions}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default memo(ActionCard);
