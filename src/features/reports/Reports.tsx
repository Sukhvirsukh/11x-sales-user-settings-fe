import { ListFilter, Search } from "lucide-react";
import { useReportQuery } from "./reportQuery";

import CustomTable, { type Column } from "@/components/design/CustomTable";
import { InputField } from "@/components/design/InputField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import GenerateReport from "./GenerateReport";
import SearchField from "@/components/shared/SearchField";

const columns: Column[] = [
    { key: "source", header: "Source", width: "280px" },
    {
        key: "status",
        header: "Status",
        align: "center",
        render: (value) => {
            const status = String(value)
            return (
                <Badge variant={status ? "default" : "destructive"}>
                    {status ? "Active" : "Inactive"}
                </Badge>
            )
        },
    },
    { key: "createdDate", header: "Created date", align: "right" },
    { key: "endDate", header: "End date", align: "right" },
]

export function Reports() {
    const { data = [], isLoading } = useReportQuery()
    const search = ""

    const setSearch = (value: string) => {
        void value
    }

    return (
        <CustomTable
            title="Role history"
            columns={columns}
            data={data}
            getRowId={(row) => String(row.id)}
            emptyMessage={isLoading ? "Loading.. role history" : search ? "No matching roles found" : "No role history found"}
            emptyDescription={isLoading ? "" : search ? "Try a different search term." : "Roles assigned to your team will appear here."}
            emptyState={isLoading ? (
                <div className="flex w-full items-center justify-center py-16">
                    <Spinner className="size-6 text-primary" />
                </div>
            ) : undefined}
            headerActions={
                <div className="flex items-center gap-2.5">
                    <SearchField onSearchChange={setSearch} />
                    <GenerateReport />
                </div>
            }
            rowActions={() => (
                <div className="flex items-center gap-2">
                    <Button variant="bare" className='underline' size="sm" onClick={() => ''}>
                        Download
                    </Button>
                </div>
            )}
            className="w-full md:[&_th:nth-child(2)]:pl-0 md:[&_td:first-child:has([role=checkbox])+td]:pl-0"
        />
    )
}
