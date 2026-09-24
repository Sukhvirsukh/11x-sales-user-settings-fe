import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    contentClassName?: string;
    headerClassName?: string;
    titleClassName?: string;
    actionsClassName?: string;
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
    contentClassName,
    headerClassName,
    titleClassName,
    actionsClassName,
}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger render={trigger} />}
            <DialogContent
                showCloseButton={false}
                className={cn(
                    "flex max-h-[80vh] max-w-md flex-col overflow-hidden gap-0 rounded-[10px] border-0 bg-popover p-0 ring-0 shadow-panel max-sm:max-h-[80vh] max-sm:overflow-hidden max-sm:bg-transparent",
                    contentClassName,
                )}
            >
                <div
                    aria-hidden="true"
                    className="absolute z-[-1] max-sm:left-1/2 max-sm:top-0 max-sm:h-20 max-sm:w-[90%] max-sm:-translate-x-1/2 max-sm:rounded-t-[20px] max-sm:bg-primary"
                />
                <div className="flex min-h-0 flex-col max-sm:mt-2 max-sm:rounded-t-[10px] max-sm:bg-popover">
                    {title && (
                        <DialogHeader className={cn(
                            "flex shrink-0 flex-row justify-between items-center p-4 bg-table-header-background rounded-t-[10px]",
                            headerClassName,
                        )}>
                            <DialogTitle className={cn("text-lg font-semibold font-inter", titleClassName)}>
                                {title}
                            </DialogTitle>
                            <DialogClose className="p-1 cursor-pointer">
                                <X size={16} className="text-modal-close" />
                            </DialogClose>
                        </DialogHeader>
                    )}

                    <div className="min-h-0 overflow-y-auto px-4 py-3.5">{children}</div>

                    {(primaryAction || secondaryAction || closeAction) && (
                        <div className={cn(
                            "flex shrink-0 items-start gap-2.5 px-4 pb-4 w-full",
                            actionsClassName,
                        )}>
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
