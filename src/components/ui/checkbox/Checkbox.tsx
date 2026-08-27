interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({
  checked = false,
  onChange,
  className = "",
}: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      className={`h-4 w-4 cursor-pointer rounded border-[#D4D4D8] accent-[#2563EB] ${className}`}
    />
  );
}
