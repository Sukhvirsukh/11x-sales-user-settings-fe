import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs"

/* ─── Pixel-perfect tab item ─── */
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
 * A reusable, pixel-perfect tab bar.
 *
 * Design tokens (derived from screenshots):
 *  – Pill shape: rounded-md (6 px)
 *  – Height: 27 px
 *  – Border: 1 px solid #DADADA (inactive) / border-subtle (active)
 *  – Shadow: subtle blue-tinted drop-shadow on active state
 *  – Font: 14 px, font-medium, black text
 *  – Padding: 7 px horizontal
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
                            /* ── Pixel-perfect pill ── */
                            "flex h-[27px] cursor-pointer items-center justify-center rounded-[6px] px-[5px]",
                            "border border-transparent bg-transparent",
                            "text-sm font-normal text-foreground",
                            "transition-all duration-150",
                            "hover:bg-gray-50",
                            /* Active state – must override base tabs styles */
                            "data-active:!border-border-tab data-active:!bg-card-nested data-active:!font-medium data-active:!text-foreground data-active:!shadow-panel",
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
