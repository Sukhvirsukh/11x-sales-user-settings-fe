import { useFormContext, useWatch } from "react-hook-form";
import type { VisibilityFields } from "./visibilityTypes";

export function useVisibilityForm() {
  const {
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<VisibilityFields>();
  const fields = useWatch({ control }) as VisibilityFields;

  return {
    fields,
    errors,
    setError,
    clearErrors,
    setField: <K extends keyof VisibilityFields>(key: K, value: VisibilityFields[K]) =>
      setValue(key as never, value as never, { shouldDirty: true, shouldValidate: true }),
  };
}
