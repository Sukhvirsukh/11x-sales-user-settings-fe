import type { Column } from "@/components/design/CustomTable"
import CustomTable from "@/components/design/CustomTable"
import { InputField } from "@/components/design/InputField"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ListFilter, Search, SquarePen, Trash } from "lucide-react"
import AddStore from "./AddStore"

const columns: Column[] = [
    {
        key: "select",
        header: "",
        width: "56px",
        render: (_, row) => <Checkbox aria-label={`Select ${row.name}`} />,
    },
    { key: "storeName", header: "Store Name", width: "280px" },
    { key: "storeUrl", header: "Store URL" },
    { key: "storeOwner", header: "Store Owner" },
    { key: "status", header: "Status", align: "center" },
    { key: "startDate", header: "Start date", align: "right" },
]

const data = [
    {
        storeName: "Sunvi",
        storeUrl: "sunvi.myshopify.com",
        storeOwner: "Racheal",
        status: "Active",
        startDate: "10/02/26",
    },
    {
        storeName: "Firr",
        storeUrl: "firr.myshopify.com",
        storeOwner: "Kimk k",
        status: "Active",
        startDate: "10/02/26",
    },
]


export function Store() {
    return (
        <div className="flex flex-col items-start gap-3.5 pb-5 pt-2">
            <div className="flex p-4 flex-col items-start gap-3.5 rounded-[10px] border border-blue-100/70 bg-white shadow-blue w-full overflow-hidden">
                {/* Basic details */}

                <CustomTable
                    title="Store"
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
                                        // containerClassName="h-[35px] bg-transparent!"
                                        // className="bg-transparent!"
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
                                    containerClassName="h-[35px] bg-transparent!"
                                    className="bg-transparent!"
                                />
                            </div>
                            <AddStore />
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
                    className="w-full md:[&_td:first-child:has([role=checkbox])+td]:pl-0"
                />

            </div>
        </div>
    )
}
