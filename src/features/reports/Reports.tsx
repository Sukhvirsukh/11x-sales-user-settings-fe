import { ListFilter, Plus, Search } from "lucide-react";
import { useReportQuery } from "./reportQuery";

import CustomTable, { type Column } from "@/components/design/CustomTable";
import { InputField } from "@/components/design/InputField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import GenerateReport from "./GenerateReport";
import { useMemo } from "react";

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
    const { data = [], isLoading, error } = useReportQuery()
    const search = ""

    // const filteredData = useMemo(() => {
    //     const query = search.trim().toLowerCase()
    //     if (!query) return data
    //     return data.filter((role) => role.name.toLowerCase().includes(query))
    // }, [data, search])


    const setSearch = () => { }

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
                    <Popover>
                        <PopoverTrigger
                            render={
                                <Button variant="ghost" size="sm" className="size-[35px] md:hidden" aria-label="Search role history">
                                    <Search className="size-4" />
                                </Button>
                            }
                        />
                        <PopoverContent side="top" align="end" sideOffset={8} className="w-[255px] max-w-[calc(100vw-2rem)] rounded-[10px] border border-blue-200 bg-white! p-3 shadow-blue ring-0! md:hidden">
                            <InputField
                                aria-label="Search role history"
                                placeholder="Search"
                                startIcon={<Search className="size-4" />}
                                endIcon={<ListFilter className="size-4" />}
                                variant="light"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </PopoverContent>
                    </Popover>
                    <div className="hidden w-full max-w-[231px] md:block">
                        <InputField
                            aria-label="Search role history"
                            placeholder="Search"
                            startIcon={<Search className="size-4" />}
                            endIcon={
                                <ListFilter className="size-4" />
                            }
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <GenerateReport />
                </div>
            }
            rowActions={(row) => (
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
