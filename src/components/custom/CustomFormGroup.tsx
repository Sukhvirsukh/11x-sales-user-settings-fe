import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const formGroupVariants = cva("flex min-w-0 flex-col", {
  variants: {
    gap: {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    },
  },
  defaultVariants: {
    gap: "md",
  },
});

type CustomFormGroupProps = ComponentProps<"div"> &
  VariantProps<typeof formGroupVariants>;

export function CustomFormGroup({
  className,
  gap = "md",
  ...props
}: CustomFormGroupProps) {
  return (
    <div className={cn(formGroupVariants({ gap }), className)} {...props} />
  );
}
