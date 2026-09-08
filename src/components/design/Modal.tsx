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
            <DialogContent showCloseButton={false} className="max-w-md p-0 gap-0 bg-white rounded-[10px] ring-0 border-0 shadow-[0_40px_4px_rgba(70,132,250,0.06),0_20px_8px_rgba(70,132,250,0.05)]">
                {title && (
                    <DialogHeader className="flex flex-row justify-between items-center py-2.5 px-4 bg-[#F7F8FB] rounded-t-[10px]">
                        <DialogTitle className="text-lg font-semibold font-inter">
                            {title}
                        </DialogTitle>
                        <DialogClose className="p-1">
                            <X size={16} className="text-[#1E1E1E]" />
                        </DialogClose>
                    </DialogHeader>
                )}

                <div className="px-4 py-3.5">{children}</div>

                {(primaryAction || secondaryAction || closeAction) && (
                    <div className="flex items-start gap-2.5 px-4 pb-4 w-full">
                        {primaryAction && (
                            <Button
                                variant="primary"
                                onClick={primaryAction.onClick}
                                disabled={primaryAction.disabled}
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
