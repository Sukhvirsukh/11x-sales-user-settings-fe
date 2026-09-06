import { z } from "zod";
import { emailSchema, passwordSchema } from "@/lib/formSchema";

export const signInSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});
