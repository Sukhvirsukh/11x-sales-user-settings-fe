import CustomTable, { type Column } from "@/components/design/CustomTable"
import { Button } from "@/components/ui/button"

const columns: Column[] = [
    { key: "name", header: "Name", width: "280px" },
    { key: "email", header: "Mail Id" },
    { key: "role", header: "Role" },
    { key: "status", header: "Status", align: "center" },
    { key: "startDate", header: "Start date", align: "right" },
]

const data = [
    {
        name: "Karl Kin",
        email: "Kia44co.com",
        role: "Subordinate",
        status: "Active",
        startDate: "10/02/26",
    },
    {
        name: "Adam Uim",
        email: "Kia44co.com",
        role: "Subordinate",
        status: "Active",
        startDate: "10/02/26",
    },
]

export default function RoleHistory() {
    return (
        <CustomTable
            title="Role history"
            columns={columns}
            data={data}
            headerActions={
                <div className="flex items-center gap-2.5">
                    <Button variant="secondary" size="sm">
                        Search
                    </Button>
                    <Button variant="primary" size="sm">
                        Add role
                    </Button>
                </div>
            }
            rowActions={(row) => (
                <div className="flex items-center gap-2">
                    <Button variant="bare" size="sm">
                        Edit
                    </Button>
                    <Button variant="bare" size="sm">
                        Delete
                    </Button>
                </div>
            )}
            className="w-full"
        />
    )
}
