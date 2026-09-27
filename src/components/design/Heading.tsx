import { memo, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("text-foreground", {
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

type HeadingSize = NonNullable<VariantProps<typeof headingVariants>["size"]>;
type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";
const breakpoints: Breakpoint[] = ["sm", "md", "lg", "xl", "2xl"];

// Keep complete class names visible to Tailwind's scanner.
const responsiveSizeClasses: Record<Breakpoint, Record<HeadingSize, string>> = {
    sm: {
        xs: "sm:text-xs sm:font-medium", sm: "sm:text-sm sm:font-medium",
        md: "sm:text-base sm:font-medium", lg: "sm:text-lg sm:font-semibold",
        xlg: "sm:text-2xl sm:font-semibold", "2xl": "sm:text-3xl sm:font-semibold",
    },
    md: {
        xs: "md:text-xs md:font-medium", sm: "md:text-sm md:font-medium",
        md: "md:text-base md:font-medium", lg: "md:text-lg md:font-semibold",
        xlg: "md:text-2xl md:font-semibold", "2xl": "md:text-3xl md:font-semibold",
    },
    lg: {
        xs: "lg:text-xs lg:font-medium", sm: "lg:text-sm lg:font-medium",
        md: "lg:text-base lg:font-medium", lg: "lg:text-lg lg:font-semibold",
        xlg: "lg:text-2xl lg:font-semibold", "2xl": "lg:text-3xl lg:font-semibold",
    },
    xl: {
        xs: "xl:text-xs xl:font-medium", sm: "xl:text-sm xl:font-medium",
        md: "xl:text-base xl:font-medium", lg: "xl:text-lg xl:font-semibold",
        xlg: "xl:text-2xl xl:font-semibold", "2xl": "xl:text-3xl xl:font-semibold",
    },
    "2xl": {
        xs: "2xl:text-xs 2xl:font-medium", sm: "2xl:text-sm 2xl:font-medium",
        md: "2xl:text-base 2xl:font-medium", lg: "2xl:text-lg 2xl:font-semibold",
        xlg: "2xl:text-2xl 2xl:font-semibold", "2xl": "2xl:text-3xl 2xl:font-semibold",
    },
};

export interface HeadingProps extends VariantProps<typeof headingVariants> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
    children: ReactNode;
    className?: string;
    /** Size overrides at Tailwind's min-width breakpoints. `size` applies below the first override. */
    responsiveSize?: Partial<Record<Breakpoint, HeadingSize>>;
}

function Heading({
    as: Comp = "h3",
    size = "lg",
    className,
    children,
    responsiveSize,
}: HeadingProps) {
    const responsiveClasses = breakpoints.map((breakpoint) => {
        const override = responsiveSize?.[breakpoint];
        return override ? responsiveSizeClasses[breakpoint][override] : undefined;
    });

    return (
        <Comp className={cn(headingVariants({ size }), responsiveClasses, className)}>
            {children}
        </Comp>
    );
}

export default memo(Heading);
