import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { FieldGroup } from "@/components/ui/field";

const formGroupVariants = cva("", {
    variants: {
        gap: {
            xs: "gap-2", //8px
            sm: "gap-2.5", //10px
            md: "gap-4", //16px
            lg: "gap-5", //20px
            xl: "gap-7", //28px
        },
    },
    defaultVariants: {
        gap: "lg",
    },
});

type CustomFormGroupProps = ComponentProps<typeof FieldGroup> &
    VariantProps<typeof formGroupVariants>;

export function FormGroup({
    className,
    gap = "lg",
    ...props
}: CustomFormGroupProps) {
    return (
        <FieldGroup
            className={cn(formGroupVariants({ gap }), className)}
            {...props}
        />
    );
}
