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
  /** `inline` participates in page layout; `fixed` overlays the viewport. */
  placement?: "inline" | "fixed";
  /** Defaults to `bottom` for inline bars and `top` for fixed bars. */
  edge?: "top" | "bottom";
  dialogTitle?: string;
  dialogDescription?: string;
  /** Overrides the Save button color (e.g. the widget's primary color). */
  primaryColor?: string;
}

export function UnSavedChangesBar({
  isDirty,
  onSave,
  onDiscard,
  message = "You have unsaved changes",
  className,
  saving = false,
  placement = "inline",
  edge,
  dialogTitle,
  dialogDescription,
  primaryColor,
}: UnSavedChangesBarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const busy = saving || isSaving;
  const resolvedEdge = edge ?? (placement === "fixed" ? "top" : "bottom");
  const isFixed = placement === "fixed";
  const isInlineBottom = !isFixed && resolvedEdge === "bottom";
  const isInlineTop = !isFixed && resolvedEdge === "top";
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
        "flex shrink-0 flex-row flex-wrap items-center justify-between gap-x-3 gap-y-2 border-border bg-surface-raised px-4 py-3",
        isInlineBottom && "py-2",
        isInlineTop && "order-first",
        isFixed
          ? resolvedEdge === "top"
            ? "fixed inset-x-0 top-0 z-99999 border-b pt-[max(0.75rem,env(safe-area-inset-top))] shadow-md"
            : "fixed inset-x-0 bottom-0 z-99999 border-t pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-md"
          : resolvedEdge === "top"
            ? "border-b"
            : "border-t",
        className,
      )}
      style={isFixed ? { zIndex: 99999 } : undefined}
    >
      <p className="min-w-0 flex-1 text-sm font-medium text-foreground">{message}</p>
      <div className="ml-auto flex shrink-0 flex-nowrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onDiscard}
          disabled={busy}
        >
          Discard
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={busy}
          style={primaryColor ? { backgroundColor: primaryColor } : undefined}
        >
          {busy ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {isFixed
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
