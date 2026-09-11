import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-[10px] border-0 px-1.5 py-1 text-[10px] font-normal leading-3 whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 md:px-2.5 md:py-1 md:text-[12px] md:leading-[15px] [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-badge-active-bg text-badge-active-text after:size-1.5 after:rounded-full after:bg-badge-active-dot after:content-[''] md:after:size-[7px] [a]:hover:bg-badge-active-bg/80",
        defaultDark:
          "bg-badge-active-dot text-primary-fg after:size-1.5 after:rounded-full after:bg-primary-fg after:content-[''] md:after:size-[7px] [a]:hover:bg-badge-active-dot/90",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        darkSecondary:
          "bg-input after:size-1.5 after:rounded-full after:bg-gray after:content-[''] md:after:size-[7px] [a]:hover:bg-black/85",
        darkSuccess:
          "bg-success-light text-success after:size-1.5 after:rounded-full after:bg-success after:content-[''] md:after:size-[7px] [a]:hover:bg-success-light/80",
        destructive:
          "bg-badge-inactive-bg text-gray after:size-1.5 after:rounded-full after:bg-badge-inactive-dot after:content-[''] md:after:size-[7px] focus-visible:ring-destructive/20 [a]:hover:bg-badge-inactive-bg/80",
        destructiveDark:
          "bg-badge-inactive-dot text-primary-fg after:size-1.5 after:rounded-full after:bg-primary-fg after:content-[''] md:after:size-[7px] focus-visible:ring-destructive/20 [a]:hover:bg-badge-inactive-dot/90",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        darkOutline:
          "border border-gray bg-border text-gray after:size-1.5 after:rounded-full after:bg-gray after:content-[''] md:after:size-[7px] [a]:hover:bg-black/5",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  indigator = true,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { indigator?: boolean }) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), !indigator && "after:hidden", className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
