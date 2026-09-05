import { memo, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface HelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
    children: ReactNode;
}

/** Field helper text — 12px, ghost */
function HelperText({ children, className, ...props }: HelperTextProps) {
    return (
        <p
            className={cn("text-sm leading-snug text-ghost", className)}
            {...props}
        >
            {children}
        </p>
    );
}

export default memo(HelperText);
