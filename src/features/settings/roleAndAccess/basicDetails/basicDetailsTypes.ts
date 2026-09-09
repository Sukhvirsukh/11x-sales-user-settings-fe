import type { z } from "zod";
import type { basicDetailsSchema } from "./basicDetailsSchema";

export type BasicDetailsFormValues = z.infer<typeof basicDetailsSchema>;
