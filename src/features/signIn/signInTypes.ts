import type { z } from "zod";
import type { signInSchema } from "./signInSchema";

export type SignInFormValues = z.infer<typeof signInSchema>;
