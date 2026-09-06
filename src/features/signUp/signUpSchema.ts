import { z } from "zod";
import { emailSchema, passwordSchema } from "@/lib/formSchema";

export const signUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: emailSchema,
    password: passwordSchema,
});
