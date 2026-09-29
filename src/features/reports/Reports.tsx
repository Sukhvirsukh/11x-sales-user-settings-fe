import { useReportQuery } from "./reportQuery";

import CustomTable, { type Column } from "@/components/design/CustomTable";
import { useCan } from "@/features/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import GenerateReport from "./GenerateReport";
import { downloadReport } from "./reportApi";
import SearchField from "@/components/shared/SearchField";

const columns: Column[] = [
    { key: "source", header: "Source", width: "280px" },
    {
        key: "status",
        header: "Status",
        align: "center",
        render: (value) => (
            <Badge variant={value ? "default" : "destructive"}>
                {value ? "Ready" : "Not ready"}
            </Badge>
        ),
    },
    { key: "createdDate", header: "Created date", align: "right" },
    { key: "startDate", header: "Start date", align: "right" },
    { key: "endDate", header: "End date", align: "right" },
]

export function Reports() {
    const { data = [], isLoading } = useReportQuery()
    // Generating a report is a change, so the button follows `reports.create`
    // alone (create implies edit). Deleting is a separate grant, not offered here.
    const canCreateReport = useCan("reports.create")
    const search = ""

    const setSearch = (value: string) => {
        void value
    }

    return (
        <CustomTable
            title="Reports"
            columns={columns}
            data={data}
            getRowId={(row) => String(row.id)}
            emptyMessage={isLoading ? "Loading reports…" : search ? "No matching reports found" : "No reports yet"}
            emptyDescription={isLoading ? "" : search ? "Try a different search term." : "Generate a report to see how your AI agent performed over a date range."}
            emptyState={isLoading ? (
                <div className="flex w-full items-center justify-center py-16">
                    <Spinner className="size-6 text-primary" />
                </div>
            ) : undefined}
            headerActions={
                <div className="flex items-center gap-2.5">
                    <SearchField onSearchChange={setSearch} />
                    {canCreateReport && <GenerateReport />}
                </div>
            }
            rowActions={(row) => (
                <div className="flex items-center gap-2">
                    <Button variant="bare" className='underline' size="sm" disabled={!row.status} onClick={() => downloadReport(row.id).catch(() => {})}>
                        Download
                    </Button>
                </div>
            )}
            className="w-full md:[&_th:nth-child(2)]:pl-0 md:[&_td:first-child:has([role=checkbox])+td]:pl-0"
        />
    )
}
