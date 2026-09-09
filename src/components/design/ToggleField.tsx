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
    showText?: boolean
    textStyle?: string
    /**
     * Visual style of the toggle.
     * "bare" — no padding, no border, no background (icon-only usage)
     * "button" — pill-shaped button with border, padding and pressed state colors
     * (named `toggleVariant` to avoid clashing with the base Toggle's `variant` prop)
     */
    toggleVariant?: "bare" | "button"
}

export function ToggleField({
    pressed,
    onPressedChange,
    checkedIcon: CheckedIcon = ToggleRight,
    uncheckedIcon: UncheckedIcon = ToggleLeft,
    iconClassName = "h-4 w-4",
    className,
    "aria-label": ariaLabel,
    showText = false,
    textStyle,
    toggleVariant = "bare",
    ...props
}: ToggleFieldProps) {
    // Renders the icon for the current state (falls back to ToggleRight/ToggleLeft)
    const ActiveIcon = pressed ? CheckedIcon : UncheckedIcon

    const text = showText
        ? pressed
            ? "Deactivate" : "Activate"
        : undefined

    return (
        <Toggle
            pressed={pressed}
            onPressedChange={onPressedChange}
            aria-label={ariaLabel}
            {...props}
            className={cn(
                "cursor-pointer",
                toggleVariant === "bare" && [
                    // No padding, no fixed size — shrink-wrap to the icon
                    "h-auto w-auto min-w-0 border-0 bg-transparent p-0",
                    // No background in any state (hover / pressed / focus)
                    "hover:bg-transparent hover:text-inherit",
                    "aria-pressed:bg-transparent",
                    "focus-visible:bg-transparent",
                ],
                toggleVariant === "button" && [
                    "h-auto rounded-[10px] border border-ghost px-3.5 py-0.5 text-sm text-ghost",
                    // Allow the caller to override the pressed-state colors
                    pressed && [
                        "bg-success-light text-success border-success py-0.5",
                        "hover:bg-success-light hover:text-success",
                        "aria-pressed:bg-success-light",
                        "focus-visible:bg-success-light focus-visible:text-success",
                    ],
                ],
                className
            )}
        >
            {showText && <span className={`${textStyle}`}>{text}</span>}
            <ActiveIcon className={iconClassName} />
        </Toggle>
    )
}
