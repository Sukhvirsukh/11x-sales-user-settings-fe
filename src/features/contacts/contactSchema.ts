import { z } from "zod";

export const segmentFormSchema = z.object({
    name: z.string().trim().min(1, "Give the segment a name").max(150, "Keep the name under 150 characters"),
    /** Optional start date; without one the segment is active straight away. */
    activeSchedule: z.date().optional(),
    rules: z.object({
        who: z.enum(["everyone", "customers", "leads"]),
        activeWithinDays: z.number().int().positive().nullable(),
        askedAbout: z.string().trim().max(100).nullable(),
        consentOnly: z.boolean(),
    }),
});
