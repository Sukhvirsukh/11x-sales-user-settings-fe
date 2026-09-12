import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { type ReactElement, type ReactNode } from "react";

interface ModalAction {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "outline" | "destructive" | "ghost";
}

interface ModalCloseAction {
    label: string;
    variant?: "primary" | "secondary" | "outline" | "destructive" | "ghost";
    disabled?: boolean;
}

interface ModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: ReactElement;
    title?: string;
    children: ReactNode;
    primaryAction?: ModalAction;
    secondaryAction?: ModalAction;
    closeAction?: ModalCloseAction;
}

export default function Modal({
    open,
    onOpenChange,
    trigger,
    title,
    children,
    primaryAction,
    secondaryAction,
    closeAction,
}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger render={trigger} />}
            <DialogContent showCloseButton={false} className="max-w-md gap-0 rounded-[10px] border-0 bg-popover p-0 ring-0 shadow-panel">
                {title && (
                    <DialogHeader className="flex flex-row justify-between items-center py-2.5 px-4 bg-table-header rounded-t-[10px]">
                        <DialogTitle className="text-lg font-semibold font-inter">
                            {title}
                        </DialogTitle>
                        <DialogClose className="p-1 cursor-pointer">
                            <X size={16} className="text-[#1E1E1E]" />
                        </DialogClose>
                    </DialogHeader>
                )}

                <div className="px-4 py-3.5">{children}</div>

                {(primaryAction || secondaryAction || closeAction) && (
                    <div className="flex items-start gap-2.5 px-4 pb-4 w-full">
                        {primaryAction && (
                            <Button
                                onClick={primaryAction.onClick}
                                disabled={primaryAction.disabled}
                                variant={primaryAction.variant ?? "primary"}
                            >
                                {primaryAction.label}
                            </Button>
                        )}
                        {secondaryAction && (
                            <Button
                                variant="secondary"
                                onClick={secondaryAction.onClick}
                                disabled={secondaryAction.disabled}
                            >
                                {secondaryAction.label}
                            </Button>
                        )}
                        {closeAction && (
                            <DialogClose
                                render={
                                    <Button
                                        variant={closeAction.variant || "secondary"}
                                        disabled={closeAction.disabled}
                                    />
                                }
                            >
                                {closeAction.label}
                            </DialogClose>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
