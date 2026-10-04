import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAgent, deleteAgents } from "./agentsApi";
import { agentsQueryKey } from "./agentsQuery";
import { toast } from "@/components/ui/toast";

interface DeleteAgentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agents: Record<string, unknown>[];
    onDeleted?: (ids: string[]) => void;
}

export default function DeleteAgent({ open, onOpenChange, agents, onDeleted }: DeleteAgentProps) {
    const queryClient = useQueryClient();
    const deleteAgentMutation = useMutation({
        mutationFn: async () => {
            const ids = agents.map((agent) => {
                if (typeof agent.id !== "string" || !agent.id) {
                    throw new Error("A selected agent does not have an ID.");
                }
                return agent.id;
            });
            if (ids.length === 1) {
                await deleteAgent(ids[0]);
            } else {
                await deleteAgents(ids);
            }
            return ids;
        },
        onSuccess: async (deletedIds) => {
            onOpenChange(false);
            onDeleted?.(deletedIds);
            toast.add({
                type: "success",
                title: deletedIds.length === 1 ? "Agent deleted" : "Agents deleted",
                description: `${deletedIds.length} ${deletedIds.length === 1 ? "agent has" : "agents have"} been deleted successfully.`,
            });
            await queryClient.invalidateQueries({ queryKey: agentsQueryKey });
        }
    });

    function confirmDelete() {
        deleteAgentMutation.mutate();
    }

    return (
        <ConfirmationModal
            variant="destructive"
            open={open}
            onOpenChange={(nextOpen) => {
                if (!deleteAgentMutation.isPending) onOpenChange(nextOpen);
            }}
            title={agents.length === 1 ? "Delete agent" : "Delete agents"}
            description={
                <>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">
                        {agents.length === 1 ? String(agents[0].agentName ?? "this agent") : `${agents.length} selected agents`}
                    </span>? This action cannot be undone.
                </>
            }
            confirmLabel={deleteAgentMutation.isPending ? "Deleting..." : "Delete"}
            confirmDisabled={agents.length === 0}
            isPending={deleteAgentMutation.isPending}
            onConfirm={confirmDelete}
        />
    );
}