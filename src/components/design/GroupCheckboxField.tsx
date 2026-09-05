import { Checkbox } from "@/components/ui/checkbox"
import Label from "./Label"

export interface GroupCheckboxOption {
    value: string
    label: string
}

export interface GroupCheckboxFieldProps {
    label: string
    options: GroupCheckboxOption[]
    value?: string[]
    onValueChange?: (value: string[]) => void
    id?: string
}

function GroupCheckboxField({
    label,
    options,
    value = [],
    onValueChange,
    id,
}: GroupCheckboxFieldProps) {
    function handleChange(optionValue: string, checked: boolean) {
        const next = checked
            ? [...value, optionValue]
            : value.filter((v) => v !== optionValue)
        onValueChange?.(next)
    }

    return (
        <div className="flex w-full flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex flex-col gap-3">
                {options.map((option) => (
                    <label
                        key={option.value}
                        htmlFor={option.value}
                        className="flex items-center gap-2"
                    >
                        <Checkbox
                            id={option.value}
                            checked={value.includes(option.value)}
                            onCheckedChange={(checked) =>
                                handleChange(option.value, checked === true)
                            }
                        />
                        <span className="text-muted-foreground">
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    )
}

GroupCheckboxField.displayName = "GroupCheckboxField"

export { GroupCheckboxField }
