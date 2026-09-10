import { useState } from "react"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import DeleteRole from "./DeleteRole"

interface DeleteSelectedRolesProps {
    roles: Record<string, unknown>[]
    onDeleted: (ids: string[]) => void
}

export default function DeleteSelectedRoles({ roles, onDeleted }: DeleteSelectedRolesProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
                <Trash className="size-4" />
                Delete selected
            </Button>
            <DeleteRole open={open} onOpenChange={setOpen} roles={roles} onDeleted={onDeleted} />
        </>
    )
}
