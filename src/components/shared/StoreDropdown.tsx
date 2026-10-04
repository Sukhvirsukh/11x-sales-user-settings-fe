import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { openAgent } from "@/features/agents/agentsApi";
import { useAgentStore } from "@/features/agents/agentStore";
import { roleForAgent } from "@/features/auth/authApi";
import { useAuthStore } from "@/features/auth/authStore";
import { queryClient } from "@/lib/queryClient";

interface StoreDropdownProps {
    className?: string;
}

/** Switches the store (agent) the whole dashboard is showing. */
export function StoreDropdown({ className }: StoreDropdownProps) {
    const agents = useAgentStore((state) => state.agents);
    const currentAgentId = useAgentStore((state) => state.currentAgentId);
    const setAgents = useAgentStore((state) => state.setAgents);

    async function handleChange(agentId: string | null) {
        if (!agentId || agentId === currentAgentId) return;
        try {
            // Opening it also makes it the user's default store next time they sign in.
            const agent = await openAgent(agentId);
            setAgents(agents.map((a) => (a.id === agent.id ? agent : a)), agent.id);
            const { user, setUser } = useAuthStore.getState();
            if (user) setUser({ ...user, role: roleForAgent(agent) });
            await queryClient.invalidateQueries();
        } catch {
            toast.add({ type: "error", title: "Couldn't switch store", description: "Please try again." });
        }
    }

    if (!agents.length) return null;

    return (
        <Select value={currentAgentId ?? undefined} onValueChange={handleChange}>
            <SelectTrigger
                className={cn(
                    "p-2.5 text-base gap-1 bg-transparent border-content-muted text-content-muted rounded-[10px] min-w-21 max-w-48 h-9.75!",
                    className
                )}
            >
                <SelectValue>
                    {agents.find((a) => a.id === currentAgentId)?.name ?? "Select store"}
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-background border-content-muted rounded-[10px]">
                {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
