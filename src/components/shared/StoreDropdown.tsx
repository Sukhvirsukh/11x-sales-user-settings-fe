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
            <SelectTrigger
                className={cn(
                    "p-2.5 text-base gap-1 bg-transparent border-ghost text-ghost rounded-[10px] w-21! h-9.75!",
                    className
                )}
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-ghost rounded-[10px]">
                {stores.map((store) => (
                    <SelectItem key={store.value} value={store.value}>
                        {store.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
