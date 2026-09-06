import type { z } from "zod";
import type { signUpSchema } from "./signUpSchema";

export type SignUpFormValues = z.infer<typeof signUpSchema>;
