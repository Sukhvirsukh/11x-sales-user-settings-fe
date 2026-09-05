"use client"

import * as React from "react"
import { ToggleLeft, ToggleRight, type LucideIcon } from "lucide-react"
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
    "aria-label": ariaLabel,
    ...props
}: ToggleFieldProps) {
    const ActiveIcon = pressed ? ToggleRight : ToggleLeft

    return (
        <Toggle
            pressed={pressed}
            onPressedChange={onPressedChange}
            aria-label={ariaLabel}
            {...props}
            className={`border-0 p-0 bg-transparent hover:bg-transparent cursor-pointer arial-pressed:bg-transparent! focus-visible:bg-transparent! data-[state=on]:bg-transparent! data-[state=on]:hover:bg-transparent! ${pressed && "bg-transparent"}`}
        >
            <ActiveIcon className={iconClassName} />
        </Toggle>
    )
}