import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { InputField } from "./InputField";
import { FieldError } from "@/components/ui/field";
import Label from "./Label";
import HelperText from "./HelperText";
import { FormGroup } from "./FormGroup";
import { Info } from "lucide-react";

interface PresetColor {
    label: string;
    value: string;
}

interface CustomColorSelectorProps {
    /** Label displayed above the field */
    label: string;
    /** Hint text displayed below the field */
    hint?: string;
    /** Placeholder text for the input */
    placeholder?: string;
    /** Controlled value (hex color string) */
    value?: string;
    /** Callback when color changes */
    onValueChange?: (color: string) => void;
    /** Default color (uncontrolled mode) */
    defaultValue?: string;
    /** Unique ID for the field */
    id?: string;
    /** Disable the entire field */
    disabled?: boolean;
    /** Custom class names */
    className?: string;
    /** Show preset color palette */
    showPresets?: boolean;
    /** Custom preset colors */
    presets?: PresetColor[];
    /** Error message displayed below the input */
    error?: string;
}

const DEFAULT_PRESETS: PresetColor[] = [
    { label: "Purple", value: "#8B5CF6" },
    { label: "Blue", value: "#3B82F6" },
    { label: "Green", value: "#10B981" },
    { label: "Yellow", value: "#F59E0B" },
    { label: "Red", value: "#EF4444" },
    { label: "Pink", value: "#EC4899" },
    { label: "Indigo", value: "#6366F1" },
    { label: "Teal", value: "#14B8A6" },
    { label: "Orange", value: "#F97316" },
    { label: "Gray", value: "#6B7280" },
    { label: "Black", value: "#000000" },
    { label: "White", value: "#FFFFFF" },
];

export function ColorSelector({
    label,
    hint,
    placeholder = "#000000",
    value: controlledValue,
    onValueChange,
    defaultValue = "#000000",
    id,
    disabled = false,
    className,
    showPresets = true,
    presets = DEFAULT_PRESETS,
    error,
}: CustomColorSelectorProps) {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const [inputValue, setInputValue] = useState(defaultValue);
    const colorInputRef = useRef<HTMLInputElement>(null);

    // Use controlled or uncontrolled value
    const color = controlledValue ?? uncontrolledValue;
    const setColor = controlledValue !== undefined ? onValueChange : setUncontrolledValue;

    // Sync the input field value when the color changes externally (picker, preset, controlled prop)
    useEffect(() => {
        setInputValue(color);
    }, [color]);

    // Validate hex color format
    const isValidHex = (hex: string): boolean => {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setInputValue(inputValue);
        // Auto-prepend # if missing
        const newColor = inputValue.startsWith("#") ? inputValue : `#${inputValue}`;
        // Always update the color, even if invalid
        setColor?.(newColor);
    };

    const handleInputBlur = () => {
        // On blur, if the color is invalid, revert to previous valid color
        if (!isValidHex(inputValue) && inputValue !== "") {
            setInputValue(color);
        }
    };

    // Determine if there's a validation error
    const hasValidationError = inputValue !== "" && !isValidHex(inputValue);

    const handleColorPickerChange = (e: ChangeEvent<HTMLInputElement>) => {
        setColor?.(e.target.value.toUpperCase());
    };

    const handlePresetClick = (presetColor: string) => {
        setColor?.(presetColor);
    };

    const openColorPicker = () => {
        if (!disabled && colorInputRef.current) {
            colorInputRef.current.click();
        }
    };

    return (
        <FormGroup className={className}>
            <Label htmlFor={id}>{label}</Label>
            <div className="flex flex-col gap-3">
                {/* Color preview + Text input + Color picker trigger */}
                <div className="flex items-center gap-2">
                    {/* Color preview circle */}
                    <button
                        type="button"
                        onClick={openColorPicker}
                        disabled={disabled}
                        className={cn(
                            "h-10 w-10 shrink-0 rounded-lg shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                        style={{ backgroundColor: isValidHex(color) ? color : "#000000" }}
                        aria-label="Open color picker"
                    />

                    {/* Hex input */}
                    <InputField
                        id={id}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        maxLength={7}
                        className="flex-1 rounded-xl font-mono"
                    />

                    {/* Native color picker — keep out of layout */}
                    <div className="hidden">
                        <input
                            ref={colorInputRef}
                            type="color"
                            value={isValidHex(color) ? color : "#000000"}
                            onChange={handleColorPickerChange}
                            disabled={disabled}
                            tabIndex={-1}
                            aria-hidden="true"
                        />
                    </div>

                    {/* Color picker button */}
                    {/* <button
                        type="button"
                        onClick={openColorPicker}
                        disabled={disabled}
                        className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                        aria-label="Choose color"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="13.5" cy="6.5" r="2.5" />
                            <circle cx="17.5" cy="10.5" r="2.5" />
                            <circle cx="8.5" cy="7.5" r="2.5" />
                            <circle cx="6.5" cy="12.5" r="2.5" />
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                        </svg>
                    </button> */}
                </div>

                {/* Preset color palette */}
                {showPresets && (
                    <div className="flex flex-wrap gap-2">
                        {presets.map((preset) => (
                            <button
                                key={preset.value}
                                type="button"
                                onClick={() => handlePresetClick(preset.value)}
                                disabled={disabled}
                                title={preset.label}
                                className={cn(
                                    "h-7 w-7 rounded-md border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                    color.toUpperCase() === preset.value.toUpperCase()
                                        ? "ring-2 ring-primary ring-offset-2"
                                        : "border-border",
                                    disabled && "opacity-50 cursor-not-allowed"
                                )}
                                style={{ backgroundColor: preset.value }}
                                aria-label={`Select ${preset.label}`}
                            />
                        ))}
                    </div>
                )}
            </div>
            {(error || hasValidationError) && (
                <FieldError className="inline-flex items-center -mt-1.5">
                    <Info className="size-3.5 shrink-0" aria-hidden />
                    {error || "Invalid color code. Use format: #RRGGBB"}
                </FieldError>
            )}
            {hint && <HelperText>{hint}</HelperText>}
        </FormGroup>
    );
}
