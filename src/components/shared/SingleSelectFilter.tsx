import { Toggle } from "@/components/ui/toggle"
import FilterGroup from "./FilterGroup"

interface SingleSelectFilterProps<T extends string> {
    label: string
    options: readonly { value: T; label: string }[]
    value: T | null
    onChange: (value: T | null) => void
}

export default function SingleSelectFilter<T extends string>({ label, options, value, onChange }: SingleSelectFilterProps<T>) {
    return (
        <FilterGroup label={label} selectedCount={value === null ? 0 : 1}>
            <div className="flex flex-wrap gap-1.5">
                {options.map((option) => (
                    <Toggle
                        key={option.value}
                        type="button"
                        variant="outline"
                        size="xs"
                        pressed={value === option.value}
                        onPressedChange={(pressed) => onChange(pressed ? option.value : null)}
                        className="rounded-full border-section-border h-5.75 px-1 text-content-muted shadow-none hover:border-primary aria-pressed:border-primary aria-pressed:bg-section-background aria-pressed:text-content-strong"
                    >
                        {option.label}
                    </Toggle>
                ))}
            </div>
        </FilterGroup>
    )
}
