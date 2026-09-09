import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { OctagonXIcon, XIcon } from "lucide-react"

interface ErrorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    description?: string
    errors?: string[]
}

export default function ErrorDialog({
    open,
    onOpenChange,
    title = "Error",
    description,
    errors = [],
}: ErrorDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="gap-0 rounded-[10px] border border-danger-dark bg-danger-light p-4 text-zinc-800 shadow-[0_2px_8px_rgba(15,23,42,0.08)] ring-0"
            >
                <DialogHeader className="pr-8">
                    <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-danger">
                        <span className="flex size-[27px] shrink-0 items-center justify-center rounded-full bg-danger/15 text-danger">
                            <OctagonXIcon aria-hidden="true" className="size-4" />
                        </span>
                        {title}
                    </DialogTitle>
                    {description && <DialogDescription className="text-sm text-zinc-400">{description}</DialogDescription>}
                    {errors.length > 0 && (
                        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-400">
                            {errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}
                        </ul>
                    )}
                </DialogHeader>
                <DialogClose
                    aria-label="Close error dialog"
                    render={
                        <Button variant="bare" size="default" className="absolute top-4 right-4 size-[27px] shrink-0 bg-transparent text-danger! hover:bg-transparent hover:opacity-70" />
                    }
                >
                    <XIcon aria-hidden="true" className="size-3.5" />
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}
