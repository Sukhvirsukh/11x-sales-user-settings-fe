import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { OctagonXIcon, XIcon } from "lucide-react"

interface ErrorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    description?: string
}

export default function ErrorDialog({
    open,
    onOpenChange,
    title = "Error",
    description,
}: ErrorDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="shadow-none"
                style={{ borderColor: "var(--danger-dark)", backgroundColor: "var(--danger-light)" }}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose
                        render={
                            <Button variant="bare" size="default" className="shrink-0 text-danger! hover:opacity-70" />
                        }
                    >
                        <XIcon className="size-3.5" />
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
