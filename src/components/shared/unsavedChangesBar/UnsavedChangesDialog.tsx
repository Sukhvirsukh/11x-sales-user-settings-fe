import ErrorModal from "../ErrorModal";

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
    <ErrorModal
      open={open}
      onOpenChange={handleOpenChange}
      message={description}
      title={title}
      onConfirm={onLeave}
      onCancel={onStay}
      confirmLabel="Leave"
      cancelLabel="Stay"
    />
  );
}
