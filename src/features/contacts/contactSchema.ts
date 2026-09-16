import { z } from "zod";

export const segamentFormSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    activeSchedule: z.date({ error: "Active schedule is required" }),
});
