import { z } from "zod";

export const correctionFormSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    corrections: z.string().trim().min(1, "Correction is required"),
    status: z.enum(["Active", "Inactive"]),
});
