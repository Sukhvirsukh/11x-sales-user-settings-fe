import type { ReactNode } from "react";
import Modal from "@/components/design/Modal";
import { DialogDescription } from "@/components/ui/dialog";

interface ConfirmationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: ReactNode;
    confirmLabel: string;
    onConfirm: () => void;
    cancelLabel?: string;
    isPending?: boolean;
    confirmDisabled?: boolean;
    variant?: "primary" | "destructive";
}

export default function ConfirmationModal({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    onConfirm,
    cancelLabel = "Cancel",
    isPending = false,
    confirmDisabled = false,
    variant = "primary",
}: ConfirmationModalProps) {
    return (
        <Modal
            open={open}
            onOpenChange={(nextOpen) => {
                if (!isPending) onOpenChange(nextOpen);
            }}
            title={title}
            contentClassName="sm:w-[326px] shadow-blue"
            actionsClassName="justify-center"
            primaryAction={{
                label: confirmLabel,
                onClick: onConfirm,
                disabled: isPending || confirmDisabled,
                variant,
            }}
            closeAction={{ label: cancelLabel, disabled: isPending }}
        >
            <DialogDescription className="text-center text-[18px] font-medium leading-6 text-foreground">
                {description}
            </DialogDescription>
        </Modal>
    );
}
