import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, X } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

export type InfoModalVariant = "default" | "warning";

export interface InfoModalProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: ReactElement;
    onConfirm: () => void;
    title: string;
    description: ReactNode;
    confirmLabel: string;
    cancelLabel: string;
    confirmDisabled?: boolean;
    cancelDisabled?: boolean;
    /** Visual treatment for the modal and its confirm action. */
    variant?: InfoModalVariant;
    /** Overrides the dialog content styles, including its default automatic width. */
    contentClassName?: string;
}

export default function InfoModal({
    open,
    defaultOpen,
    onOpenChange,
    trigger,
    onConfirm,
    title,
    description,
    confirmLabel,
    cancelLabel,
    confirmDisabled,
    cancelDisabled,
    variant = "default",
    contentClassName,
}: InfoModalProps) {
    return (
        <Dialog
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
        >
            {trigger && <DialogTrigger render={trigger} />}
            <DialogContent
                showCloseButton={false}
                data-variant={variant}
                className={cn(
                    "left-1/2 right-auto bottom-auto top-1/2 flex w-auto min-w-[320px] -translate-x-1/2 -translate-y-1/2 flex-col gap-0 overflow-hidden rounded-[10px] border border-section-border bg-popover px-4 pb-4 pt-[50px] shadow-panel ring-0 max-sm:max-w-[calc(100%-2rem)] max-sm:overflow-hidden max-sm:rounded-[10px]",
                    variant === "warning" && "border-0",
                    contentClassName,
                )}
            >
                <div
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none absolute left-0 top-0 aspect-square w-[93%] -translate-x-[32%] -translate-y-[14%] rounded-full bg-primary/10",
                        variant === "warning" && "bg-danger/15",
                    )}
                />

                <DialogClose
                    render={
                        <Button
                            type="button"
                            variant="bare"
                            disabled={cancelDisabled}
                            className="absolute right-4 top-4 z-10 size-6 rounded-md p-0! text-content-muted hover:text-foreground"
                            aria-label="Close"
                        />
                    }
                >
                    <X className="size-3.5" aria-hidden="true" />
                </DialogClose>

                <div className="relative z-1 text-center">
                    <DialogTitle className="mx-auto max-w-[320px] text-lg md:text-3xl font-bold leading-7 text-foreground">
                        {title}
                    </DialogTitle>
                    <DialogDescription
                        render={<div />}
                        className="mt-2 text-sm font-medium leading-4 text-content-muted"
                    >
                        {description}
                    </DialogDescription>
                </div>

                <div className="relative z-1 mt-3.5 flex flex-col gap-2.5">
                    <Button
                        type="button"
                        variant={variant === "warning" ? "destructive" : "primary"}
                        onClick={onConfirm}
                        disabled={confirmDisabled}
                    >
                        {confirmLabel}
                        <ArrowRight className="ml-1 size-3" aria-hidden="true" />
                    </Button>
                    <DialogClose
                        render={
                            <Button
                                type="button"
                                variant="ghost"
                                disabled={cancelDisabled}
                                className="h-8 w-full rounded-md p-0! text-xs"
                            />
                        }
                    >
                        {cancelLabel}
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
