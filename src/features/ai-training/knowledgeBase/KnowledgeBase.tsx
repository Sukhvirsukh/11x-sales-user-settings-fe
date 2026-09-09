import CustomTable, { type Column } from "@/components/design/CustomTable";
import { InputField } from "@/components/design/InputField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ListFilter, Search, SquarePen, Trash } from "lucide-react";
import AddKnowledge from "./AddKnowledge";


const columns: Column[] = [
    {
        key: "select",
        header: "",
        width: "56px",
        render: (_, row) => <Checkbox aria-label={`Select ${row.name}`} />,
    },
    { key: "name", header: "Name", width: "280px" },
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
    { key: "format", header: "Format", align: "right" },
]

const data = [
    {
        name: "https://learnwipro.com",
        status: "Active",
        createDate: "10/02/26",
        lastRefresh: "10/02/26",
        format: "Link",
    },
    {
        name: "Stripe - Products, Customers",
        status: "Active",
        createDate: "10/02/26",
        lastRefresh: "10/02/26",
        format: "Integration",
    },
    {
        name: "Product catalogue",
        status: "Inactive",
        createDate: "10/02/26",
        lastRefresh: "10/02/26",
        format: "Document",
    },
]

export function KnowledgeBase() {
    return (
        <CustomTable
            title="Knowledge base"
            columns={columns}
            data={data}
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
                            />
                        </PopoverContent>
                    </Popover>
                    <div className="hidden w-full max-w-[231px] md:block">
                        <InputField
                            placeholder="Search"
                            startIcon={<Search className="size-4" />}
                            endIcon={
                                <ListFilter className="size-4" />
                            }
                        />
                    </div>
                    {/* <AddRoleForm /> */}
                    <AddKnowledge />
                </div>
            }
            rowActions={() => (
                <div className="flex items-center gap-2">
                    <Button variant="bare" size="sm">
                        <SquarePen className="size-4 text-gray" />
                    </Button>
                    <Button variant="bare" size="sm">
                        <Trash className="size-4 text-gray" />
                    </Button>
                </div>
            )}
            className="w-full md:[&_th:nth-child(2)]:pl-0 md:[&_td:first-child:has([role=checkbox])+td]:pl-0"
        />
    )
}
