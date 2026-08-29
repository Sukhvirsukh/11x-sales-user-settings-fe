import { useCallback, useEffect } from "react";
import { useBlocker } from "react-router";

interface UseUnsavedChangesWarningOptions {
  isDirty: boolean;
  unsavedMessage?: string;
}

interface UseUnsavedChangesWarningReturn {
  isBlocking: boolean;
  proceed: () => void;
  cancel: () => void;
}

export function useUnsavedChangesWarning({
  isDirty,
  unsavedMessage = "You have unsaved changes. Are you sure you want to leave?",
}: UseUnsavedChangesWarningOptions): UseUnsavedChangesWarningReturn {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = unsavedMessage;
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, unsavedMessage]);

  const proceed = useCallback(() => {
    if (blocker.state === "blocked") blocker.proceed();
  }, [blocker]);

  const cancel = useCallback(() => {
    if (blocker.state === "blocked") blocker.reset();
  }, [blocker]);

  return {
    isBlocking: blocker.state === "blocked",
    proceed,
    cancel,
  };
}
