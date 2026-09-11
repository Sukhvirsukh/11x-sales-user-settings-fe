import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex h-fit w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  variant = "inset",
  ...props
}: AccordionPrimitive.Item.Props & { variant?: "inset" | "card" }) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      data-variant={variant}
      className={cn(
        "h-fit min-w-0",
        variant === "inset" && "not-last:border-b not-last:border-border-light",
        variant === "card" && "rounded-[10px] border border-border bg-card px-4",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex w-full">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex min-h-11 w-full flex-1 cursor-pointer items-center justify-between py-5 text-left text-body font-medium text-foreground bg-transparent outline-none transition-colors hover:no-underline focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50 md:text-lg md:font-semibold",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-body data-ending-style:h-0 data-starting-style:h-0 data-open:h-auto"
      {...props}
    >
      <div
        className={cn(
          "min-w-0",
          "in-data-[variant=inset]:mb-4 in-data-[variant=inset]:rounded-[10px] in-data-[variant=inset]:bg-section-bg in-data-[variant=inset]:p-2.5 md:in-data-[variant=inset]:p-4",
          "in-data-[variant=card]:bg-muted in-data-[variant=card]:pb-3",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
