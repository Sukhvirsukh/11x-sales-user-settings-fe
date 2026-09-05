import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  /** `inline` sits in the page footer. `fixed` overlays the full viewport above everything. */
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
  const [mounted, setMounted] = useState(false);
  const busy = saving || isSaving;
  const { isBlocking, proceed, cancel } = useUnsavedChangesWarning({ isDirty });

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  }

  if (!isDirty) {
    return (
      <UnsavedChangesDialog
        open={isBlocking}
        onStay={cancel}
        onLeave={proceed}
        title={dialogTitle}
        description={dialogDescription}
      />
    );
  }

  const bar = (
    <div
      role="region"
      aria-label="Unsaved changes"
      aria-live="polite"
      className={cn(
        "flex shrink-0 flex-col gap-3 border-border bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        placement === "fixed"
          ? "fixed inset-x-0 top-0 z-[99999] border-b pt-[max(0.75rem,env(safe-area-inset-top))] shadow-md"
          : "border-t",
        className,
      )}
      style={placement === "fixed" ? { zIndex: 99999 } : undefined}
    >
      <p className="text-sm font-medium text-foreground">{message}</p>
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
        <Button type="button" onClick={handleSave} disabled={busy}>
          {busy ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {placement === "fixed"
        ? mounted
          ? createPortal(bar, document.body)
          : null
        : bar}

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
