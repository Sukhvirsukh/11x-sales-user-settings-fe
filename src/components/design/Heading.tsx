import { memo, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("text-foreground", {
    variants: {
        size: {
            /** 16px, semi-bold */
            lg: "text-lg font-semibold",
            /** 14px, medium */
            md: "text-base font-medium",
        },
    },
    defaultVariants: {
        size: "lg",
    },
});

export interface HeadingProps extends VariantProps<typeof headingVariants> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
    children: ReactNode;
    className?: string;
}

function Heading({
    as: Comp = "h3",
    size = "lg",
    className,
    children,
}: HeadingProps) {
    return (
        <Comp className={cn(headingVariants({ size }), className)}>
            {children}
        </Comp>
    );
}

export default memo(Heading);
export { headingVariants };
