import { useMemo, useState } from "react";
import { SquarePen, Trash } from "lucide-react";

import CustomTable, { type Column } from "@/components/design/CustomTable";
import SearchField from "@/components/shared/SearchField";
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCan } from "@/features/auth";

import DeleteCorrections from "./DeleteCorrections";
import EditCorrection from "./EditCorrection";
import { useCorrectionsQuery } from "./correctionsQuery";
import type { Correction } from "./correctionTypes";

const columns: Column[] = [
    { key: "name", header: "Name", width: "280px" },
    {
        key: "corrections",
        header: "Corrections",
        width: "300px",
        render: (value) => {
            const correction = String(value ?? "");
            return (
                <span title={correction} className="block md:max-w-[260px] md:truncate">
                    {correction}
                </span>
            );
        },
    },
    {
        key: "status",
        header: "Status",
        align: "center",
        render: (value) => {
            const status = String(value);
            return (
                <Badge variant={status === "Active" ? "default" : "destructive"}>
                    {status}
                </Badge>
            );
        },
    },
    { key: "createDate", header: "Create date" },
    { key: "lastRefresh", header: "Last refresh", align: "right" },
];

const searchKeys = columns.map((column) => column.key);

export function Corrections() {
    const { data = [], isLoading, error } = useCorrectionsQuery();
    const canCreateCorrections = useCan("aiTraining.create");
    const canDeleteCorrections = useCan("aiTraining.delete");
    const [search, setSearch] = useState("");
    const [editCorrection, setEditCorrection] = useState<Correction | null>(null);
    const [deleteRequest, setDeleteRequest] = useState<{
        rows: Correction[];
        onDeleted?: (ids: string[]) => void;
    } | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const filteredData = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return data;

        return data.filter((row) =>
            searchKeys.some((key) =>
                String(row[key as keyof Correction] ?? "").toLowerCase().includes(query),
            ),
        );
    }, [data, search]);

    if (error) throw error;

    function handleEditModalChange(open: boolean) {
        if (!open) setEditCorrection(null);
    }

    function handleDeleteModalChange(open: boolean) {
        setIsDeleteOpen(open);
        if (!open) setDeleteRequest(null);
    }

    function requestDelete(rows: Correction[], onDeleted?: (ids: string[]) => void) {
        setDeleteRequest({ rows, onDeleted });
        setIsDeleteOpen(true);
    }

    return (
        <>
            <CustomTable
                title="Corrections"
                columns={columns}
                data={filteredData}
                selectable={canDeleteCorrections}
                getRowId={(row) => row.id}
                bulkActions={canDeleteCorrections ? ((rows, deselectRows) => (
                    <Button variant="destructive" size="xs" onClick={() => requestDelete(rows, deselectRows)}>
                        <Trash className="size-3.5" />
                        Delete selected
                    </Button>
                )) : undefined}
                emptyMessage={search ? "No matching corrections found" : "No corrections found"}
                emptyDescription={search ? "Try a different search term." : "Corrections will appear here."}
                emptyState={isLoading ? <TableSkeleton columns={5} showHeader={false} /> : undefined}
                headerActions={
                    <div className="flex items-center gap-2.5">
                        <SearchField onSearchChange={setSearch} />
                    </div>
                }
                rowActions={canCreateCorrections || canDeleteCorrections ? (row) => (
                    <div className="flex items-center gap-2">
                        {canCreateCorrections && (
                            <Button
                                variant="bare"
                                size="sm"
                                onClick={() => setEditCorrection(row)}
                                aria-label="Edit correction"
                            >
                                <SquarePen className="size-4 text-content-muted" />
                            </Button>
                        )}
                        {canDeleteCorrections && (
                            <Button
                                variant="bare"
                                size="sm"
                                onClick={() => requestDelete([row])}
                                aria-label="Delete correction"
                            >
                                <Trash className="size-4 text-content-muted" />
                            </Button>
                        )}
                    </div>
                ) : undefined}
                className="w-full"
            />
            {canCreateCorrections && <EditCorrection
                open={editCorrection !== null}
                onOpenChange={handleEditModalChange}
                correction={editCorrection}
            />}
            {canDeleteCorrections && <DeleteCorrections
                open={isDeleteOpen}
                onOpenChange={handleDeleteModalChange}
                rows={deleteRequest?.rows ?? []}
                onDeleted={deleteRequest?.onDeleted}
            />}
        </>
    );
}
