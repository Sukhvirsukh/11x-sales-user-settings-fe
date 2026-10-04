import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAgentStore } from "@/stores/agentStore";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAgentsQuery } from "./agentsQuery";
import { parseAgentFilters } from "./agentsFilters";

const dropdownFilters = parseAgentFilters(new URLSearchParams());

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
    const { data } = useAgentsQuery(dropdownFilters);
    const selectedAgentId = useAgentStore((state) => state.selectedAgentId);
    const setSelectedAgentId = useAgentStore((state) => state.setSelectedAgentId);

    const options = useMemo(() => {
        if (agents) return agents;

        return (
            data?.pages
                .flatMap((page) => page.items)
                .flatMap((agent) => agent.id ? [{
                    label: agent.name,
                    value: agent.id,
                }] : []) ?? []
        );
    }, [agents, data]);

    // Initialize once the asynchronous options arrive. A partial page of agents
    // must not overwrite an existing selection shared by other dropdowns.
    useEffect(() => {
        if (useAgentStore.getState().selectedAgentId || options.length === 0) return;

        const initialAgent = options.find((option) => option.value === defaultValue)
            ?? options[0];
        setSelectedAgentId(initialAgent.value);
    }, [defaultValue, options, selectedAgentId, setSelectedAgentId]);

    function handleValueChange(next: string | null) {
        setSelectedAgentId(next);
        onValueChange?.(next);
    }

    return (
        <Select items={options} value={selectedAgentId} onValueChange={handleValueChange}>
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
                className="w-max min-w-(--anchor-width) max-w-[min(90vw,28 rem)] bg-background border-content-muted rounded-[10px]"
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
