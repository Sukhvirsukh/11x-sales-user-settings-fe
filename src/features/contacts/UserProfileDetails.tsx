import { useMemo, useState } from "react"
import { Download, Trash } from "lucide-react"

import type { Column } from "@/components/design/CustomTable"
import CustomTable from "@/components/design/CustomTable"
import { Button } from "@/components/ui/button"
import SearchField from "@/components/shared/SearchField"
import TableSkeleton from "@/components/shared/skeletons/TableSkeletons"
import DeleteContacts from "./DeleteContacts"
import { useUserProfilesQuery } from "./contactQuery"
import type { UserProfile } from "./contactType"



const columns: Column[] = [
    { key: "name", header: "Name", width: "280px" },
    { key: "email", header: "Mail Id" },
    { key: "phoneNo", header: "Phone No" },
    { key: "noOfConversions", header: "No of Conversions", align: "right" },
    { key: "startDate", header: "Start date", align: "right" },
]

/** Every displayed column is searchable. */
const searchKeys = columns.map((column) => column.key)

export default function UserProfileDetails() {
    const { data = [], isLoading, error } = useUserProfilesQuery()
    const [search, setSearch] = useState("")
    const [deleteRequest, setDeleteRequest] = useState<{
        rows: UserProfile[]
        onDeleted?: (ids: string[]) => void
    } | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    if (error) throw error

    const filteredData = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return data

        return data.filter((row) =>
            searchKeys.some((key) =>
                String(row[key as keyof UserProfile] ?? "").toLowerCase().includes(query)
            )
        )
    }, [data, search])

    function handleDeleteModalChange(open: boolean) {
        setIsDeleteOpen(open)
        if (!open) setDeleteRequest(null)
    }

    function requestDelete(rows: UserProfile[], onDeleted?: (ids: string[]) => void) {
        setDeleteRequest({ rows, onDeleted })
        setIsDeleteOpen(true)
    }

    return (
        <>
            <CustomTable
                title="All user profiles"
                columns={columns}
                data={filteredData}
                selectable
                getRowId={(row) => row.id}
                bulkActions={(rows, deselectRows) => (
                    <Button variant="destructive" size="xs" onClick={() => requestDelete(rows, deselectRows)}>
                        <Trash className="size-3.5" />
                        Delete selected
                    </Button>
                )}
                emptyMessage={search ? "No matching user profiles found" : "No user profiles found"}
                emptyDescription={search ? "Try a different search term." : "User profiles will appear here."}
                emptyState={isLoading ? (
                    <TableSkeleton columns={5} showHeader={false} />
                ) : undefined}
                headerActions={
                    <div className="flex items-center gap-2.5">
                        <SearchField onSearchChange={setSearch} />
                    </div>
                }
                rowActions={(row) => (
                    <div className="flex items-center gap-2">
                        <Button variant="bare" size="sm" onClick={() => requestDelete([row])}>
                            <Trash className="size-4 text-gray" />
                        </Button>
                    </div>
                )}
                className="w-full md:[&_th:nth-child(2)]:pl-0 md:[&_td:first-child:has([role=checkbox])+td]:pl-0"
            />
            <DeleteContacts
                kind="userProfile"
                open={isDeleteOpen}
                onOpenChange={handleDeleteModalChange}
                rows={deleteRequest?.rows ?? []}
                onDeleted={deleteRequest?.onDeleted}
            />
        </>
    )
}
