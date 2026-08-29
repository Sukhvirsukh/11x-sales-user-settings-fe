import type { ComponentProps } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function CustomLabel({
  className,
  children,
  ...props
}: ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn(
        "text-body-sm font-medium leading-none text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </Label>
  );
}
