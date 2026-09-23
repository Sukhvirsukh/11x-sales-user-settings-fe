import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import type { ReactNode } from "react";

export interface InfoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    description: ReactNode;
    confirmLabel: string;
    cancelLabel: string;
    confirmDisabled?: boolean;
    cancelDisabled?: boolean;
}

export default function InfoModal({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmLabel,
    cancelLabel,
    confirmDisabled,
    cancelDisabled,
}: InfoModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="left-1/2 right-auto bottom-auto top-1/2 flex w-[calc(100%-2rem)] max-w-[450px]! -translate-x-1/2 -translate-y-1/2 flex-col gap-0 overflow-hidden rounded-[10px] border border-section-border bg-popover px-4 pb-4 pt-[50px] shadow-panel ring-0 max-sm:max-w-[calc(100%-2rem)] max-sm:rounded-[10px]"
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-33.75 -top-15 size-104.5 rounded-full bg-primary/10"
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
