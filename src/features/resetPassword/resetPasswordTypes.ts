import type { z } from "zod";
import type { resetPasswordSchema } from "./resetPasswordSchema";

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;