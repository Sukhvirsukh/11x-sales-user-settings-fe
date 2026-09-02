import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Label from "./Label"

export interface GroupRadioOption {
    value: string
    label: string
}

export interface GroupRadioFieldProps {
    label: string
    options: GroupRadioOption[]
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    id?: string
}

function GroupRadioField({
    label,
    options,
    value,
    defaultValue,
    onValueChange,
    id,
}: GroupRadioFieldProps) {
    return (
        <div className="flex w-full flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <RadioGroup
                value={value}
                defaultValue={defaultValue}
                onValueChange={(nextValue) => {
                    if (typeof nextValue === "string") {
                        onValueChange?.(nextValue)
                    }
                }}
            >
                {options.map((option) => (
                    <div key={option.value} className="flex items-center gap-3">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label
                            className="font-normal text-muted-foreground"
                            htmlFor={option.value}
                        >
                            {option.label}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    )
}

GroupRadioField.displayName = "GroupRadioField"

export { GroupRadioField }
