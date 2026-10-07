import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 cursor-pointer rounded-lg border border-transparent font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow] outline-none select-none focus-visible:ring-2 focus-visible:ring-focus-ring/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Ink: the one main action on a screen.
        primary:
          "bg-primary text-primary-contrast shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] hover:bg-primary-hover",

        // Bordered surface button for secondary actions.
        outline:
          "border-border bg-surface-raised text-foreground shadow-panel hover:border-border-strong hover:bg-control-hover",

        // Quieter bordered action.
        secondary:
          "border-border bg-transparent text-muted-foreground hover:bg-control-hover hover:text-foreground",

        // Borderless, for toolbars and dense rows.
        ghost:
          "bg-transparent text-muted-foreground hover:bg-control-hover-strong hover:text-foreground",

        // No border, no background — just children
        bare:
          "border-transparent bg-transparent hover:bg-control-hover",

        // Underlined text action
        "underline-bare":
          "border-transparent bg-transparent text-content-muted p-0! underline underline-offset-2 hover:bg-transparent hover:text-foreground",

        // Simple Link
        link:
          "text-link underline-offset-4 hover:underline",

        // Inline card actions such as "Show all".
        action:
          "h-auto rounded-none p-0! text-muted-foreground hover:bg-transparent hover:text-foreground",

        destructive:
          "bg-danger text-white hover:bg-danger-strong",
      },
      size: {
        icon: "size-9 p-0 md:p-0",
        xsm: "h-7 px-2.5 text-sm",
        xs: "h-7 rounded-md px-2 text-[11px]",
        sm: "h-8 px-3 text-sm",
        default: "h-9 px-3.5 text-sm md:text-base",
        full: "h-10 w-full px-5 text-base",
      },
    },
    compoundVariants: [
      {
        variant: "bare",
        className: "h-auto p-0 md:p-0",
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
