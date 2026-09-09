import { z } from "zod";

export const basicDetailsSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
    phone: z.string().trim().min(1, "Phone number is required"),
});
