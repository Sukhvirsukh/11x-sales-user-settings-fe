import InfoModal from "@/components/shared/InfoModal";

interface UnsavedChangesDialogProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
  title?: string;
  description?: string;
}

export function UnsavedChangesDialog({
  open,
  onStay,
  onLeave,
  title = "Unsaved changes",
  description = "You have unsaved changes. If you leave, your changes will be lost.",
}: UnsavedChangesDialogProps) {
  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) onStay();
  }

  return (
    <InfoModal
      variant="warning"
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      description={description}
      confirmLabel="Leave"
      cancelLabel="Stay"
      onConfirm={onLeave}
    />
  );
}
