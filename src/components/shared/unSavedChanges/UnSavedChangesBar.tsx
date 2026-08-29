import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UnsavedChangesDialog } from "./UnsavedChangesDialog";
import { useUnsavedChangesWarning } from "./useUnsavedChangesWarning";

interface UnSavedChangesBarProps {
  isDirty: boolean;
  onSave: () => void | Promise<void>;
  onDiscard: () => void;
  message?: string;
  className?: string;
  saving?: boolean;
  /** `inline` sits in the page footer. `fixed` overlays the viewport. */
  placement?: "inline" | "fixed";
  dialogTitle?: string;
  dialogDescription?: string;
}

export function UnSavedChangesBar({
  isDirty,
  onSave,
  onDiscard,
  message = "You have unsaved changes",
  className,
  saving = false,
  placement = "inline",
  dialogTitle,
  dialogDescription,
}: UnSavedChangesBarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const busy = saving || isSaving;
  const { isBlocking, proceed, cancel } = useUnsavedChangesWarning({ isDirty });

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      {isDirty && (
        <div
          role="region"
          aria-label="Unsaved changes"
          aria-live="polite"
          className={cn(
            "z-40 flex shrink-0 flex-col gap-3 border-t border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
            placement === "fixed" &&
              "fixed inset-x-0 bottom-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg",
            className,
          )}
        >
          <p className="text-body-sm font-medium text-foreground">{message}</p>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDiscard}
              disabled={busy}
            >
              Discard
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={busy}
            >
              {busy ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}

      <UnsavedChangesDialog
        open={isBlocking}
        onStay={cancel}
        onLeave={proceed}
        title={dialogTitle}
        description={dialogDescription}
      />
    </>
  );
}
