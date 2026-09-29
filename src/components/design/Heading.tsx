import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
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

/** Mobile size used when `responsive` is set: 14px, semi-bold below `md`. */
const responsiveClasses = "max-md:text-base max-md:font-semibold";

/** Elements the heading can render as. */
export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

interface HeadingBaseProps extends VariantProps<typeof headingVariants> {
    children: ReactNode;
    className?: string;
    /** Renders 14px semi-bold below `md`, keeping `size` for wider screens. */
    responsive?: boolean;
}

/**
 * Props for `Heading`. The rendered element is selected with `as`, and every
 * native attribute of that element (`id`, `aria-*`, `title`, handlers, `ref`, …)
 * is forwarded, so the component stays usable for a11y wiring such as
 * `aria-labelledby` or `aria-level`.
 *
 * React 19 supports `ref` as a plain prop on function components, so no
 * `forwardRef` wrapper is needed and `ref` is typed from the rendered element.
 */
export type HeadingProps<T extends HeadingTag = "h3"> = HeadingBaseProps &
    Omit<ComponentPropsWithRef<T>, keyof HeadingBaseProps> & {
        /** Element to render. Defaults to `h3`. */
        as?: T;
    };

function Heading<T extends HeadingTag = "h3">({
    as,
    size = "lg",
    responsive = false,
    className,
    children,
    ...props
}: HeadingProps<T>) {
    const Comp = (as ?? "h3") as ElementType;

    return (
        <Comp
            className={cn(headingVariants({ size }), responsive && responsiveClasses, className)}
            {...props}
        >
            {children}
        </Comp>
    );
}

export default Heading;
