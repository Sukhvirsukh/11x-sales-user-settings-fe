import Modal from "../design/Modal";
import { Button } from "../ui/button";
import { ListFilter } from "lucide-react";
import { useState, type ReactElement, type ReactNode } from "react";

export interface FilterModalProps {
    trigger: ReactElement;
    children?: ReactNode;
    selectedCount?: number;
    onClearAll?: () => void;
    onSubmit?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}


function EmptyFilterState() {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-section-border bg-surface-raised px-4 py-10 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-section-background text-primary">
                <ListFilter aria-hidden="true" className="size-5" />
            </span>
            <p className="text-sm font-medium text-content-strong">No filters available yet.</p>
            <p className="text-sm text-content-muted">Filters for this table will appear here.</p>
        </div>
    );
}

export default function FilterModal({
    trigger,
    children,
    selectedCount = 0,
    onClearAll,
    onSubmit,
    open,
    onOpenChange,
}: FilterModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = open ?? internalOpen;

    const handleOpenChange = (nextOpen: boolean) => {
        if (open === undefined) setInternalOpen(nextOpen);
        onOpenChange?.(nextOpen);
    };

    const handleSubmit = () => {
        onSubmit?.();
        handleOpenChange(false);
    };

    return (
        <Modal
            open={isOpen}
            onOpenChange={handleOpenChange}
            trigger={trigger}
            title={`Filters (${String(selectedCount)})`}
            headerAction={
                <Button
                    type="button"
                    variant="underline-bare"
                    size="sm"
                    disabled={!onClearAll || selectedCount === 0}
                    onClick={onClearAll}
                >
                    Clear all
                </Button>
            }
            primaryAction={{ label: "Submit", onClick: handleSubmit, disabled: !onSubmit }}
            closeAction={{ label: "Cancel", variant: "secondary" }}
        >
            {children ?? (
                <EmptyFilterState />
            )}
        </Modal>
    );
}
