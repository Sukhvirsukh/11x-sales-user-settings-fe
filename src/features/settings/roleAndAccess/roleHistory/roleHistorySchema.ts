import { z } from "zod";
import { isValidRole } from "./roleOptions";
import { permissionValuesSchema } from "@/features/auth/permissionSchema";

export const roleFormSchema = z.object({
    permissions: permissionValuesSchema,
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
    role: z
        .string()
        .min(1, "Role is required")
        .refine(isValidRole, "Select a valid role"),
    // startDate: z.date({ error: "Joining date is required" }),
});
