import type { z } from "zod";
import type { forgotPasswordSchema } from "./forgotPasswordSchema";

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
