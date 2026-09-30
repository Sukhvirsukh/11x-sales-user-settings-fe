import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Heading from "@/components/design/Heading"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface ErrorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    /** Dialog heading. Defaults to `"Validation error"`. */
    title?: string
    /** One-line summary of what went wrong, shown above the error list. */
    message?: string
    /**
     * Problems to list, one bullet each, keyed by the field they belong to
     * (e.g. `{ "Agent name": "This field is required" }`). The key is rendered
     * in bold ahead of its message.
     */
    errors?: Record<string, string>
    /** Label of the primary action. Only shown when `onConfirm` is passed. Defaults to `"Retry"`. */
    confirmLabel?: string
    /**
     * Label of the secondary action, which closes the dialog. Only shown when
     * `onCancel` is passed. Defaults to `"Cancel"`.
     */
    cancelLabel?: string
    /** Called when the primary action is pressed. Omit to hide the button. */
    onConfirm?: () => void
    /** Called after the secondary action closes the dialog. Omit to hide the button. */
    onCancel?: () => void
    /** Overrides the dialog content styles. */
    className?: string
}

/**
 * Error dialog with a danger outline, a summary line and a bullet list of
 * problems. Built on the shared `Dialog` primitives so it keeps the standard
 * overlay and mobile bottom-sheet behaviour.
 */
export default function ErrorModal({
    open,
    onOpenChange,
    title = "Validation error",
    message,
    errors = {},
    confirmLabel = "Retry",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    className,
}: ErrorModalProps) {
    const errorEntries = Object.entries(errors)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className={cn(
                    // Desktop: fixed 406px panel with a danger outline and the
                    // blue glow from the design. On mobile the panel rises from
                    // the bottom edge like `Modal`: the popup goes transparent and
                    // borderless so the `primary` cap can peek above the inner
                    // card, and the glow becomes `shadow-panel`.
                    "flex w-[406px] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-[10px] border border-danger bg-popover p-0 ring-0 shadow-blue max-sm:overflow-hidden max-sm:border-0 max-sm:bg-transparent max-sm:shadow-panel sm:max-w-[406px]",
                    className,
                )}
            >
                <div
                    aria-hidden="true"
                    className="absolute z-[-1] max-sm:left-1/2 max-sm:top-0 max-sm:h-20 max-sm:w-[90%] max-sm:-translate-x-1/2 max-sm:rounded-t-[20px] max-sm:bg-primary"
                />

                <div className="relative flex min-h-0 flex-col max-sm:mt-2 max-sm:rounded-t-[10px] max-sm:bg-popover">
                    <DialogClose
                        render={
                            <Button
                                type="button"
                                variant="bare"
                                size="icon"
                                aria-label="Close"
                                className="absolute right-6 top-2.5 size-8 rounded-md p-0!"
                            />
                        }
                    >
                        <X size={16} aria-hidden="true" className="text-modal-close" />
                    </DialogClose>

                    <div className="flex min-h-0 flex-col overflow-y-auto px-6.5 pb-9 pt-4">
                        <DialogTitle
                            render={
                                <Heading size="lg" as="h2" className="text-content-strong">
                                    {title}
                                </Heading>
                            }
                        />

                        {(message || errorEntries.length > 0) && (
                            <div role="alert" className="mt-4 rounded-lg bg-danger-surface p-2.5">
                                {message && (
                                    <DialogDescription render={<p />} className="text-base text-content-strong">
                                        {message}
                                    </DialogDescription>
                                )}

                                {errorEntries.length > 0 && (
                                    <ul className={cn("flex flex-col", message && "mt-2.5")}>
                                        {errorEntries.map(([field, errorMessage]) => (
                                            <li
                                                key={field}
                                                className="flex items-center gap-0.5 text-sm leading-5 text-content-strong"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="size-1.5 shrink-0 rounded-full bg-content-strong"
                                                />
                                                <span className="ml-1 text-sm">
                                                    <span className="font-semibold">{field}</span>: {errorMessage}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {(onConfirm || onCancel) && (
                            <div className="mt-8 flex gap-2.5">
                                {onConfirm && (
                                    <Button type="button" onClick={onConfirm} className="flex-[1.5]">
                                        {confirmLabel}
                                    </Button>
                                )}

                                {onCancel && (
                                    <DialogClose
                                        render={
                                            <Button type="button" variant="secondary" className="flex-1" />
                                        }
                                        onClick={onCancel}
                                    >
                                        {cancelLabel}
                                    </DialogClose>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
