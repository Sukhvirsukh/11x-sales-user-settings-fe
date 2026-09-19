import CustomTable, { type Column } from "@/components/design/CustomTable";
import SearchField from "@/components/shared/SearchField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SquarePen, Trash } from "lucide-react";

const columns: Column[] = [
    {
        key: "select",
        header: "",
        width: "56px",
        render: (_, row) => <Checkbox aria-label={`Select ${row.name}`} />,
    },
    { key: "name", header: "Name", width: "280px" },
    { key: "corrections", header: "Corrections" },
    {
        key: "status",
        header: "Status",
        align: "center",
        render: (value) => {
            const status = String(value)
            return (
                <Badge variant={status === "Active" ? "default" : "destructive"}>
                    {status}
                </Badge>
            )
        },
    },
    { key: "createDate", header: "Create date" },
    { key: "lastRefresh", header: "Last refresh", align: "right" },
]

const data = [
    {
        name: "Do you have anything in black shoe?",
        corrections: "Yes, we have exactly in navy bluish black",
        status: "Active",
        createDate: "10/02/26",
        lastRefresh: "10/02/26",
    },
    {
        name: "Do you have anything in black shoe?",
        orrections: "Yes, we have exactly in navy bluish black",
        status: "Active",
        createDate: "10/02/26",
        lastRefresh: "10/02/26",
    }
]

export function Corrections() {
    return (
        <CustomTable
            title="Knowledge base"
            columns={columns}
            data={data}
            headerActions={
                <div className="flex items-center gap-2.5">
                    <SearchField onSearchChange={() => { }} />
                </div>
            }
            rowActions={() => (
                <div className="flex items-center gap-2">
                    <Button variant="bare" size="sm">
                        <SquarePen className="size-4 text-content-muted" />
                    </Button>
                    <Button variant="bare" size="sm">
                        <Trash className="size-4 text-content-muted" />
                    </Button>
                </div>
            )}
            className="w-full md:[&_th:nth-child(2)]:pl-0 md:[&_td:first-child:has([role=checkbox])+td]:pl-0"
        />
    )
}
