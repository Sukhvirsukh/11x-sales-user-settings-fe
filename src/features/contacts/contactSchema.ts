import { z } from "zod";

export const segmentFormSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    activeSchedule: z.date({ error: "Active schedule is required" }),
});
