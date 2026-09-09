import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { FieldGroup } from "@/components/ui/field";

const formGroupVariants = cva("", {
    variants: {
        col: {
            1: "",
            2: "md:grid md:grid-cols-2",
        },
        gap: {
            xs: "gap-2",       // 8px
            sm: "gap-2.5",     // 10px
            md: "gap-[14px]",  // 14px
            lg: "gap-4",       // 16px
            xl: "gap-5",       // 20px
            "2xl": "gap-7",    // 28px
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
