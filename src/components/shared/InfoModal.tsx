import Modal from "@/components/design/Modal";
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
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            contentClassName="min-h-[180px] max-w-[340px]!"
            headerClassName="p-4"
            titleClassName="text-lg font-semibold"
            actionsClassName="justify-center"
            primaryAction={{
                label: confirmLabel,
                onClick: onConfirm,
                disabled: confirmDisabled,
            }}
            closeAction={{
                label: cancelLabel,
                variant: "outline",
                disabled: cancelDisabled,
            }}
        >
            <p className="text-xl font-medium">{description}</p>
        </Modal>
    );
}
