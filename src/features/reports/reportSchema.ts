import { z } from "zod";

export const reportFormSchema = z.object({
    source: z.string().trim().min(1, "Report name is required"),
    startDate: z.date({ error: "Start date is required" }),
    endDate: z.date({ error: "End date is required" }),
}).refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
});
