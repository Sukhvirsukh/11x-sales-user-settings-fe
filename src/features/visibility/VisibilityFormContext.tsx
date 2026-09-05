import { useFormContext, useWatch } from "react-hook-form";
import type { VisibilityFields } from "@/components/shared/chatBox/type";

export function useVisibilityForm() {
  const { control, setValue } = useFormContext<VisibilityFields>();
  const fields = useWatch({ control }) as VisibilityFields;

  return {
    fields,
    setField: <K extends keyof VisibilityFields>(key: K, value: VisibilityFields[K]) =>
      setValue(key as never, value as never, { shouldDirty: true, shouldValidate: true }),
  };
}
