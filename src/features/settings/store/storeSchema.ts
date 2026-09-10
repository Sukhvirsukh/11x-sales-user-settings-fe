import z from "zod";

export const storeSchema = z.object({
    name: z.string().min(1, "Store name is required"),
    url: z.string().min(1, "Store URL is required"),
    owner: z.string().min(1, "Store owner is required"),
    startDate: z.date().optional(),
    isDefault: z.boolean(),
    status: z.boolean(),
});
