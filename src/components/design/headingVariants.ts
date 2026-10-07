import { cva } from "class-variance-authority";

export const headingVariants = cva("font-display tracking-[-0.01em] text-foreground", {
    variants: {
        size: {
            /** 24px, semi-bold */
            "2xl": "text-3xl font-semibold",
            /** 20px, semi-bold */
            xlg: "text-2xl font-semibold",
            /** 16px, semi-bold */
            lg: "text-lg font-semibold",
            /** 14px, medium */
            md: "text-base font-medium",
            /** 12px, medium */
            sm: "text-sm font-medium",
            /** 10px, medium */
            xs: "text-xs font-medium",
        },
    },
    defaultVariants: {
        size: "lg",
    },
});
