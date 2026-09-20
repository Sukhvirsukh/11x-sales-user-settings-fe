import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { FieldGroup } from "@/components/ui/field";

const formGroupVariants = cva("", {
    variants: {
        col: {
            1: "",
            2: "md:grid md:grid-cols-2",
            3: "md:grid md:grid-cols-3",
        },
        gap: {
            xs: "gap-2.5 md:gap-2",       // 10px mobile, 8px desktop
            sm: "gap-2.5",                // 10px
            md: "gap-2.5 md:gap-[14px]",  // 10px mobile, 14px desktop
            lg: "gap-2.5 md:gap-4",       // 10px mobile, 16px desktop
            xl: "gap-2.5 md:gap-5",       // 10px mobile, 20px desktop
            "2xl": "gap-2.5 md:gap-7",    // 10px mobile, 28px desktop
        },
    },
    defaultVariants: {
        col: 1,
        gap: "lg",
    },
});

type CustomFormGroupProps = ComponentProps<typeof FieldGroup> &
    VariantProps<typeof formGroupVariants>;

export function FormGroup({
    className,
    col = 1,
    gap = "lg",
    ...props
}: CustomFormGroupProps) {
    return (
        <FieldGroup
            className={cn(formGroupVariants({ col, gap }), className)}
            {...props}
        />
    );
}
