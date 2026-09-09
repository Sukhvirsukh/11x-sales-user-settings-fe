import type { ComponentProps, ReactNode } from "react"
import { CircleCheck, Info, OctagonX, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"

const variants = {
    success: {
        className: "border-success/20 bg-success-light",
        iconClassName: "text-success",
        icon: CircleCheck,
    },
    destructive: {
        className: "border-danger-dark/20 bg-danger-light",
        iconClassName: "text-badge-inactive-dot",
        icon: OctagonX,
    },
    info: {
        className: "border-section-border bg-active-bg",
        iconClassName: "text-primary",
        icon: Info,
    },
    warning: {
        className: "border-warning/20 bg-warning-light",
        iconClassName: "text-warning",
        icon: TriangleAlert,
    },
}

export interface BannerProps extends Omit<ComponentProps<"div">, "title"> {
    variant?: keyof typeof variants
    title?: ReactNode
    isIcon?: boolean
}

export function Banner({
    variant = "info",
    isIcon = false,
    title,
    children,
    className,
    role = variant === "destructive" ? "alert" : "status",
    ...props
}: BannerProps) {
    const { icon: Icon, className: variantClassName, iconClassName } = variants[variant]

    return (
        <div
            role={role}
            data-slot="banner"
            data-variant={variant}
            className={cn(
                "flex w-full items-start gap-3 rounded-[10px] border p-4 text-sm text-black shadow-panel",
                variantClassName,
                className,
            )}
            {...props}
        >
            {isIcon && <Icon aria-hidden="true" className={cn("size-5 shrink-0", iconClassName)} />}
            <div className="min-w-0 flex-1 break-words">
                {title && <div className="font-semibold">{title}</div>}
                {children && <div className={cn("leading-relaxed", title && "mt-1")}>{children}</div>}
            </div>
        </div>
    )
}
