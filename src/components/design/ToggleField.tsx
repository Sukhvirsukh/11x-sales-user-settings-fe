"use client"

import * as React from "react"
import { ToggleLeft, ToggleRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Toggle } from "@/components/ui/toggle"

interface ToggleFieldProps extends React.ComponentPropsWithoutRef<typeof Toggle> {
    pressed: boolean
    onPressedChange: (pressed: boolean) => void
    checkedIcon?: LucideIcon
    uncheckedIcon?: LucideIcon
    iconClassName?: string
    "aria-label"?: string
}

export function ToggleField({
    pressed,
    onPressedChange,
    checkedIcon: CheckedIcon = ToggleRight,
    uncheckedIcon: UncheckedIcon = ToggleLeft,
    iconClassName = "h-4 w-4",
    className,
    "aria-label": ariaLabel,
    ...props
}: ToggleFieldProps) {
    // Renders the icon for the current state (falls back to ToggleRight/ToggleLeft)
    const ActiveIcon = pressed ? CheckedIcon : UncheckedIcon

    return (
        <Toggle
            pressed={pressed}
            onPressedChange={onPressedChange}
            aria-label={ariaLabel}
            {...props}
            className={cn(
                // No padding, no fixed size — shrink-wrap to the icon
                "h-auto w-auto min-w-0 border-0 bg-transparent p-0",
                // No background in any state (hover / pressed / focus)
                "hover:bg-transparent hover:text-inherit",
                "aria-pressed:bg-transparent",
                "focus-visible:bg-transparent",
                "cursor-pointer",
                className
            )}
        >
            <ActiveIcon className={iconClassName} />
        </Toggle>
    )
}
