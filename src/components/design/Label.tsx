import { memo, type LabelHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    children: ReactNode;
}

/** Form field label — 14px, medium */
function Label({ children, className, ...props }: LabelProps) {
    return (
        <label
            className={cn(
                "text-base font-medium text-field-text",
                className
            )}
            {...props}
        >
            {children}
        </label>
    );
}

export default memo(Label);
