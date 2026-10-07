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
    /** "sidebar" is the full-width switcher at the top of the navigation. */
    variant?: "compact" | "sidebar";
}

function StoreInitial({ name }: { name: string }) {
    return (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand-soft font-display text-[12px] font-semibold text-brand">
            {name.trim().charAt(0).toUpperCase() || "S"}
        </span>
    );
}

/** Switches the store (agent) the whole dashboard is showing. */
export function StoreDropdown({ className, variant = "compact" }: StoreDropdownProps) {
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

    const currentName = agents.find((a) => a.id === currentAgentId)?.name ?? "Select store";

    return (
        <Select value={currentAgentId ?? undefined} onValueChange={handleChange}>
            <SelectTrigger
                aria-label="Switch store"
                className={cn(
                    variant === "sidebar"
                        ? "h-10! w-full gap-2 rounded-lg border-border bg-surface-raised px-2 text-base font-medium text-foreground shadow-panel hover:bg-control-hover"
                        : "h-9! min-w-21 max-w-48 gap-1 rounded-lg border-border bg-surface-raised px-2.5 text-base text-foreground",
                    className
                )}
            >
                <SelectValue>
                    <span className="flex min-w-0 items-center gap-2">
                        {variant === "sidebar" && <StoreInitial name={currentName} />}
                        <span className="truncate">{currentName}</span>
                    </span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-lg border-border bg-popover">
                {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                        <span className="flex min-w-0 items-center gap-2">
                            <StoreInitial name={agent.name} />
                            <span className="truncate">{agent.name}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
