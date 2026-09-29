import { useState } from "react"
import Modal from "@/components/design/Modal"
import { TextAreaField } from "@/components/design/TextAreaField"
import { Button } from "@/components/ui/button"

export default function AddNote() {
    const [open, setOpen] = useState(false)
    const [note, setNote] = useState("")

    function handleOpenChange(nextOpen: boolean) {
        // Drop any abandoned draft when the popup closes.
        if (!nextOpen) setNote("")
        setOpen(nextOpen)
    }

    function handleSave() {
        // Notes aren't persisted yet — the endpoint isn't available.
        setNote("")
        setOpen(false)
    }

    return (
        <Modal
            open={open}
            onOpenChange={handleOpenChange}
            title="Add note"
            trigger={
                <Button variant="bare" size="sm">
                    Add note
                </Button>
            }
            primaryAction={{ label: "Save", onClick: handleSave, disabled: !note.trim() }}
            closeAction={{ label: "Cancel" }}
        >
            <TextAreaField
                aria-label="Note"
                placeholder="Write a note..."
                rows={4}
                value={note}
                onChange={(event) => setNote(event.target.value)}
            />
        </Modal>
    )
}
