import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles: pill shape (rounded-xl/2xl), font adjustments, transitions
  "inline-flex shrink-0 items-center justify-center cursor-pointer rounded-xl border border-transparent font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary Blue (as seen in "Generate" & "Submit")
        primary:
          "bg-primary text-primary-contrast hover:bg-primary-hover",

        // Dark Outline / Black Border (as seen in middle "Generate")
        outline:
          "border-content-strong bg-transparent text-content-strong hover:bg-control-hover-strong",

        // Gray outline
        secondary:
          "border-content-muted bg-transparent text-content-muted hover:bg-control-hover",

        // Same as secondary
        ghost:
          "border-content-muted bg-transparent text-content-muted hover:bg-control-hover",

        // No border, no background — just children
        bare:
          "border-transparent bg-transparent hover:bg-control-hover",

        // Underlined text action
        "underline-bare":
          "border-transparent bg-transparent text-content-muted underline underline-offset-2 hover:bg-transparent hover:text-foreground",

        // Simple Link
        link:
          "text-link underline-offset-4 hover:underline",

        // Underlined action used for inline card actions such as "Show all".
        action:
          "h-auto rounded-none text-content-muted underline underline-offset-2 hover:bg-transparent hover:text-foreground",

        // destructive
        destructive:
          "bg-danger text-primary-contrast hover:bg-danger-strong",

      },
      size: {
        icon: "size-9 p-0 md:p-0",
        xsm: "rounded-[10px] px-2 py-1.5 text-sm",
        xs: "h-7 rounded-md px-2 text-[11px]",
        sm: "rounded-[10px] px-2.5 py-1.5 text-sm md:p-2",
        default: "rounded-[10px] px-2 py-1.5 text-sm md:px-4 md:py-[9px] md:text-base",
        full: "w-full rounded-[10px] px-2.5 py-1.5 text-sm md:h-10 md:px-5 md:py-0 md:text-base",
      },
    },
    compoundVariants: [
      {
        variant: "bare",
        className: "p-0 md:p-0",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
