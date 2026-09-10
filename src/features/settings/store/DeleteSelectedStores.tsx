import { useState } from "react"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import DeleteStore from "./DeleteStore"

interface DeleteSelectedStoresProps {
    stores: Record<string, unknown>[]
    onDeleted: (ids: string[]) => void
}

export default function DeleteSelectedStores({ stores, onDeleted }: DeleteSelectedStoresProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
                <Trash className="size-4" />
                Delete selected
            </Button>
            <DeleteStore open={open} onOpenChange={setOpen} stores={stores} onDeleted={onDeleted} />
        </>
    )
}
