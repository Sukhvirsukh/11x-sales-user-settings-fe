import { Toggle } from "../ui/toggle";
import { InputField } from "./InputField";
import Label from "./Label";

interface FormFieldToggleProps {
    label: string;
    name: string;
    pressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
}

interface FormFieldGroupProps {
    label: string;
    toggles: FormFieldToggleProps[];
    inputDisabled?: boolean;
    inputPlaceholder?: string;
    inputValue: string;
    inputError?: string;
    onChange: (value: string) => void;
    isMulti?: boolean;
    pressed?: FormFieldToggleProps["name"] | null;
    onPressedChange?: (name: string | null) => void;
}

export default function FormFieldGroup({ label, toggles, inputDisabled, inputPlaceholder = "Enter token here", inputValue, inputError, onChange, isMulti = false, pressed, onPressedChange }: FormFieldGroupProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">
                {
                    label
                }
            </Label>
            <div className="flex md:gap-1.5 gap-0.5 flex-wrap">
                {
                    toggles.map((toggle) => (
                        <Toggle
                            key={toggle.name}
                            id={toggle.name}
                            name={toggle.name}
                            size="xs"
                            variant="outline"
                            className="py-[0.5px]"
                            aria-label={toggle.label}
                            pressed={isMulti ? toggle.pressed : toggle.name === pressed}
                            onPressedChange={(isPressed) =>
                                isMulti
                                    ? toggle.onPressedChange?.(isPressed)
                                    : onPressedChange?.(isPressed ? toggle.name : null)
                            }
                        >
                            {toggle.label}
                        </Toggle>
                    ))
                }
            </div>
            <InputField
                placeholder={inputPlaceholder}
                labelClassName="text-sm font-medium"
                disabled={inputDisabled}
                error={inputError}
                value={inputValue}
                onChange={(event) => onChange(event.currentTarget.value)}
            />
        </div>
    )
}
