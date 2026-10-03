import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAgentsQuery } from "./agentsQuery";

export interface AgentsDropdownProps {
    agents?: { label: string; value: string }[];
    defaultValue?: string;
    onValueChange?: (value: string | null) => void;
    className?: string;
}

export function AgentsDropdown({
    agents,
    defaultValue,
    onValueChange,
    className,
}: AgentsDropdownProps) {
    const { data } = useAgentsQuery();

    const options = useMemo(() => {
        if (agents) return agents;

        return (
            data?.pages
                .flatMap((page) => page.items)
                .map((agent) => ({
                    label: agent.name,
                    value: String(agent.id ?? agent.name),
                })) ?? []
        );
    }, [agents, data]);

    // The list arrives asynchronously, so the select is controlled and falls back
    // to the first agent while nothing (or something stale) is selected.
    const [selected, setSelected] = useState<string | undefined>(defaultValue);
    const value =
        selected && options.some((option) => option.value === selected)
            ? selected
            : options[0]?.value;

    function handleValueChange(next: string | null) {
        setSelected(next ?? undefined);
        onValueChange?.(next);
    }

    return (
        <Select value={value} onValueChange={handleValueChange}>
            <SelectTrigger
                className={cn(
                    "p-2.5 text-base gap-1 bg-transparent border-content-muted text-content-muted rounded-[10px] w-21! h-9.25!",
                    className
                )}
            >
                <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            {/* alignItemWithTrigger={false} drops the popup below the trigger like
                a native select instead of overlaying it on the selected item. */}
            <SelectContent
                alignItemWithTrigger={false}
                align="start"
                side="bottom"
                className="w-(--anchor-width) min-w-0 bg-background border-content-muted rounded-[10px]"
            >
                {options.map((agent) => (
                    <SelectItem key={agent.value} value={agent.value}>
                        {agent.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
