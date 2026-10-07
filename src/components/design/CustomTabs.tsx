import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs"

/* ─── Tab item ─── */
export interface CustomTabItem {
    id: string
    label: string
    icon?: ReactNode
}

/* ─── Component props ─── */
export interface CustomTabsProps {
    /** Array of tab definitions */
    tabs: CustomTabItem[]
    /** Currently active tab id (controlled) */
    value?: string
    /** Tab id to open initially when the component is uncontrolled */
    defaultTab?: string
    /** Called when the user clicks a tab */
    onValueChange?: (value: string) => void
    /** Content to render for each tab (keyed by tab id) */
    children: ReactNode
    /** Optional class on the outermost wrapper */
    className?: string
    /** Optional class on the TabsList */
    listClassName?: string
    /** Optional class on each TabsTrigger */
    triggerClassName?: string
    /** Optional class on each TabsContent panel */
    contentClassName?: string
}

/**
 * A reusable tab bar.
 *
 * Underlined tabs on a hairline: inactive tabs are muted text, the active
 * one is ink with a 2 px signal-orange rule sitting on the hairline.
 */
export function CustomTabs({
    tabs,
    value,
    defaultTab,
    onValueChange,
    children,
    className,
    listClassName,
    triggerClassName,
    contentClassName,
}: CustomTabsProps) {
    const [uncontrolledValue, setUncontrolledValue] = useState(
        () => defaultTab ?? tabs[0]?.id ?? "",
    )
    const activeValue = value ?? uncontrolledValue

    function handleValueChange(nextValue: string) {
        if (value === undefined) {
            setUncontrolledValue(nextValue)
        }
        onValueChange?.(nextValue)
    }

    return (
        <Tabs
            value={activeValue}
            onValueChange={handleValueChange}
            className={cn("flex flex-col gap-4", className)}
        >
            {/* ── Tab bar ── */}
            <TabsList
                variant="line"
                className={cn(
                    "inline-flex w-fit items-center gap-3 bg-transparent !p-0",
                    listClassName,
                )}
            >
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className={cn(
                            /* Underlined tab: muted until active, then ink with a signal-orange rule. */
                            "relative flex h-10 flex-none cursor-pointer items-center justify-center rounded-none px-0.5",
                            "border-0 bg-transparent",
                            "text-base font-medium text-muted-foreground",
                            "transition-colors duration-150 hover:text-foreground",
                            "after:!absolute after:!inset-x-0 after:!-bottom-px after:!h-0.5 after:!rounded-full after:!bg-brand after:!opacity-0",
                            "data-active:!bg-transparent data-active:!text-foreground data-active:!shadow-none data-active:after:!opacity-100",
                            /* Icons */
                            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-3.5",
                            triggerClassName,
                        )}
                    >
                        {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {/* ── Panels ── */}
            <TabsContent
                value={activeValue}
                className={cn("flex-1 text-sm outline-none", contentClassName)}
            >
                {children}
            </TabsContent>
        </Tabs>
    )
}
