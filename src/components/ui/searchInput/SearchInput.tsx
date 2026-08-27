import { Search, SlidersHorizontal } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function SearchInput({
  placeholder = "Search",
  value = "",
  onChange,
  className = "",
  style,
}: SearchInputProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border border-[#D4D4D8] bg-white px-3 py-2 transition-colors focus-within:border-[#2563EB] focus-within:shadow-[0_0_0_3px_#DBEAFE] ${className}`}
      style={style}
    >
      <Search className="h-4 w-4 shrink-0 text-[#8A8A94]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="flex-1 bg-transparent text-sm text-[#1A1A1A] outline-none placeholder:text-[#A0A0AA]"
      />
      <SlidersHorizontal className="h-4 w-4 shrink-0 cursor-pointer text-[#8A8A94] hover:text-[#6B6B76] transition-colors" />
    </div>
  );
}
