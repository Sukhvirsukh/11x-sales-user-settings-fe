import { z } from "zod";
import { emailSchema } from "@/lib/formSchema";

export const forgotPasswordSchema = z.object({
    email: emailSchema,
});
