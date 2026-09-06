import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles: pill shape (rounded-xl/2xl), font adjustments, transitions
  "inline-flex shrink-0 items-center justify-center cursor-pointer rounded-xl border border-transparent text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary Blue (as seen in "Generate" & "Submit")
        primary:
          "bg-primary text-white hover:bg-primary-hover",

        // Dark Outline / Black Border (as seen in middle "Generate")
        outline:
          "border-black bg-transparent text-black hover:bg-zinc-100",

        // Gray outline
        secondary:
          "border-ghost bg-transparent text-ghost hover:bg-zinc-50",

        // Same as secondary
        ghost:
          "border-ghost bg-transparent text-ghost hover:bg-zinc-50",

        // No border, no background — just children
        bare:
          "border-transparent bg-transparent p-0 hover:bg-zinc-50",

        // Simple Link
        link:
          "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",

        // destructive
        destructive:
          "bg-danger text-white hover:bg-danger-dark",

      },
      size: {
        sm: "p-[8px] text-sm rounded-[10px]",
        default: "p-[10px] text-base rounded-[10px]",
        full: "w-full h-10 px-5 text-base rounded-[10px]",
      },
    },
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
