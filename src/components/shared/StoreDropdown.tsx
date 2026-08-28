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
}: StoreDropdownProps) {
  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger className="h-[35px] w-[97px] rounded-[9px] border-[#a4a4ab] text-[14px] font-medium text-[#6d6d76]">
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
