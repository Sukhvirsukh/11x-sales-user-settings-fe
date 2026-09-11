import { z } from "zod";

export const reportFormSchema = z.object({
    source: z.string().trim().min(1, "Source Name is required"),
    startDate: z.date({ error: "Joining date is required" }),
    endDate: z.date({ error: "Joining date is required" }),
}).refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
});
