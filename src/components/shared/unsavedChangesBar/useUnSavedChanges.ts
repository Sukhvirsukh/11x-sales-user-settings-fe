import { useCallback, useRef, useState } from "react";

interface UseUnSavedChangesOptions<T> {
  initialState: T;
  onSave?: (state: T) => void | Promise<void>;
}

interface UseUnSavedChangesReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T)) => void;
  isDirty: boolean;
  handleSave: () => Promise<void>;
  handleDiscard: () => void;
  resetDirty: () => void;
}

export function useUnSavedChanges<T>({
  initialState,
  onSave,
}: UseUnSavedChangesOptions<T>): UseUnSavedChangesReturn<T> {
  const [state, setStateInternal] = useState<T>(initialState);
  const [isDirty, setIsDirty] = useState(false);
  const lastSavedState = useRef<T>(initialState);

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setStateInternal((prev) =>
      typeof newState === "function"
        ? (newState as (prev: T) => T)(prev)
        : newState,
    );
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (onSave) await onSave(state);
    lastSavedState.current = state;
    setIsDirty(false);
  }, [state, onSave]);

  const handleDiscard = useCallback(() => {
    setStateInternal(lastSavedState.current);
    setIsDirty(false);
  }, []);

  const resetDirty = useCallback(() => {
    lastSavedState.current = state;
    setIsDirty(false);
  }, [state]);

  return {
    state,
    setState,
    isDirty,
    handleSave,
    handleDiscard,
    resetDirty,
  };
}
