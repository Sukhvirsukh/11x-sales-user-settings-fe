import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StoreDropdownProps {
  stores?: { label: string; value: string }[];
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
  className?: string;
}

const defaultStores = [
  { label: "Store1", value: "store1" },
  { label: "Store2", value: "store2" },
  { label: "Store3", value: "store3" },
];

export function StoreDropdown({
  stores = defaultStores,
  defaultValue = "store1",
  onValueChange,
  className,
}: StoreDropdownProps) {
  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger className={cn("h-[35px] min-w-[97px] flex-1 rounded-[9px] border-subtle text-body font-medium text-muted-foreground md:w-[97px] md:flex-none", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {stores.map((store) => (
          <SelectItem key={store.value} value={store.value}>
            {store.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
