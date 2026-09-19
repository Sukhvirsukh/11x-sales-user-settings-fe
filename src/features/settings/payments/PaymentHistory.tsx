
import type { Column } from "@/components/design/CustomTable"
import CustomTable from "@/components/design/CustomTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SquarePen, Trash } from "lucide-react"
import AddNewPayment from "./AddNewPayment"
import SearchField from "@/components/shared/SearchField"



const columns: Column[] = [
    {
        key: "select",
        header: "",
        width: "56px",
        render: (_, row) => <Checkbox aria-label={`Select ${row.name}`} />,
    },
    { key: "invoiceNumber", header: "Invoice Number", width: "280px" },
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
    { key: "startDate", header: "Start date", },
    { key: "amount", header: "Amount", align: "right" },
    { key: "method", header: "Method", align: "right" },
]

const data = [
    {
        invoiceNumber: "S456RT789P1116",
        status: "Active",
        startDate: "10/02/26",
        amount: "INR 500",
        method: "Card"
    },
    {
        invoiceNumber: "S456RT789P1216",
        status: "Active",
        startDate: "10/02/26",
        amount: "INR 400",
        method: "AMount"
    },
]

export default function PaymentHistory() {
    return (

        <CustomTable
            title="Payment history"
            columns={columns}
            data={data}
            headerActions={
                <div className="flex items-center gap-2.5">
                    <SearchField onSearchChange={() => { }} />
                    <AddNewPayment />
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
