import type { Column } from "@/components/design/CustomTable";
import CustomTable from "@/components/design/CustomTable";
import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash } from "lucide-react";
import AddAgent from "./AddAgent";
import DeleteAgent from "./DeleteAgent";
import { Badge } from "@/components/ui/badge";
import { useAgentsQuery } from "./agentsQuery";
import { useState } from "react";
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons";
import AgentsFilter from "./AgentsFilter";
import { useCan } from "@/features/auth";

const columns: Column[] = [
    { key: "name", header: "Agent Name", width: "280px" },
    { key: "url", header: "Store URL" },
    { key: "owner", header: "Agent Owner" },
    {
        key: "status",
        header: "Status",
        align: "center",
        render: (value) => {
            const isActive = value === true || String(value).toLowerCase() === "active";
            return (
                <Badge variant={isActive ? "default" : "destructive"}>
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    { key: "startDate", header: "Start date", align: "right" },
];

export function Agents() {
    // Create implies edit, so adding and editing an agent share one grant — only
    // delete is asked for separately.
    const canCreateAgent = useCan("settings.store.create");
    const canDeleteAgent = useCan("settings.store.delete");
    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, hasFilters } = useAgentsQuery();
    const agents = data?.pages.flatMap((page) => page.items) ?? [];
    const [editAgent, setEditAgent] = useState<Record<string, unknown> | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [deleteRequest, setDeleteRequest] = useState<{
        agents: Record<string, unknown>[];
        onDeleted?: (ids: string[]) => void;
    } | null>(null);

    if (error) throw error;

    function openCreateAgent() {
        setEditAgent(null);
        setIsOpen(true);
    }

    function openEditAgent(agent: Record<string, unknown>) {
        setEditAgent(agent);
        setIsOpen(true);
    }

    function handleModalOpenChange(open: boolean) {
        setIsOpen(open);
        if (!open) setEditAgent(null);
    }

    function requestDelete(agents: Record<string, unknown>[], onDeleted?: (ids: string[]) => void) {
        setDeleteRequest({ agents, onDeleted });
    }

    return (
        <>
            <CustomTable
                title={`Agent (${data?.pages[0]?.totalCount ?? 0})`}
                columns={columns}
                data={agents}
                infiniteScroll={{
                    onLoadMore: () => { void fetchNextPage() },
                    hasMore: Boolean(hasNextPage),
                    isFetching: isFetchingNextPage,
                }}
                selectable={canDeleteAgent}
                mobileColumnSplit={['40%', '60%']}
                getRowId={(row) => String(row.id)}
                bulkActions={canDeleteAgent ? ((rows, deselectRows) => (
                    <Button variant="destructive" size="xs" onClick={() => requestDelete(rows, deselectRows)}>
                        <Trash className="size-3.5" />
                        Delete selected
                    </Button>
                )) : undefined}
                emptyMessage={hasFilters ? "No matching agents found" : "No agents found"}
                emptyDescription={hasFilters ? "Try a different search term or filter." : "Agents connected to your account will appear here."}
                emptyState={
                    isLoading ? (
                        <TableSkeleton columns={6} rows={4} showHeader={false} />
                    ) : undefined
                }
                headerActions={
                    <div className="flex items-center gap-2.5">
                        <AgentsFilter />
                        {canCreateAgent && (
                            <Button variant="primary" onClick={openCreateAgent}>
                                Add agent
                                <Plus className="ml-0.5 size-2 md:ml-2 md:size-3.5" />
                            </Button>
                        )}
                    </div>
                }
                rowActions={canCreateAgent || canDeleteAgent ? ((row) => (
                    <div className="flex items-center gap-2">
                        {canCreateAgent && (
                            <Button variant="bare" size="sm" onClick={() => openEditAgent(row)} aria-label="Edit agent">
                                <SquarePen className="size-4 text-content-muted" />
                            </Button>
                        )}
                        {canDeleteAgent && (
                            <Button variant="bare" size="sm" onClick={() => requestDelete([row])} aria-label="Delete agent">
                                <Trash className="size-4 text-content-muted" />
                            </Button>
                        )}
                    </div>
                )) : undefined}
                className="w-full"
            />
            {canCreateAgent && <AddAgent
                open={isOpen}
                onOpenChange={handleModalOpenChange}
                agent={editAgent}
            />}
            {canDeleteAgent && <DeleteAgent
                open={deleteRequest !== null}
                onOpenChange={(open) => {
                    if (!open) setDeleteRequest(null);
                }}
                agents={deleteRequest?.agents ?? []}
                onDeleted={deleteRequest?.onDeleted}
            />}
        </>
    );
}