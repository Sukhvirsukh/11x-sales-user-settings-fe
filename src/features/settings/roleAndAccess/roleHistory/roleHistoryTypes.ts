import type { z } from "zod";
import type { roleFormSchema } from "./roleHistorySchema";

export type RoleFormValues = z.infer<typeof roleFormSchema>;
