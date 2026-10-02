import { Toggle } from "@/components/ui/toggle"
import FilterGroup from "./FilterGroup"

interface MultiSelectFilterProps<T extends string> {
    label: string
    options: readonly { value: T; label: string }[]
    /** Applied values; an empty array means no filter. */
    value: T[]
    onChange: (value: T[]) => void
}

export default function MultiSelectFilter<T extends string>({ label, options, value, onChange }: MultiSelectFilterProps<T>) {
    /**
     * Keeps values in the order the options are declared, so the same selection always
     * serializes to the same URL/query key however the user toggled them.
     */
    const toggle = (option: T, pressed: boolean) => {
        const next = new Set(value)
        if (pressed) next.add(option)
        else next.delete(option)

        onChange(options.filter((item) => next.has(item.value)).map((item) => item.value))
    }

    return (
        <FilterGroup label={label} selectedCount={value.length}>
            <div className="flex flex-wrap gap-1.5">
                {options.map((option) => (
                    <Toggle
                        key={option.value}
                        type="button"
                        variant="outline"
                        size="xs"
                        pressed={value.includes(option.value)}
                        onPressedChange={(pressed) => toggle(option.value, pressed)}
                        className="rounded-full border-section-border text-content-muted shadow-none hover:border-primary aria-pressed:border-primary aria-pressed:bg-section-background aria-pressed:text-content-strong"
                    >
                        {option.label}
                    </Toggle>
                ))}
            </div>
        </FilterGroup>
    )
}
