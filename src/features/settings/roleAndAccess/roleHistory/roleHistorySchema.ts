import { z } from "zod";

export const roleFormSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
    role: z.string().min(1, "Role is required"),
    startDate: z.date({ error: "Joining date is required" }),
});
