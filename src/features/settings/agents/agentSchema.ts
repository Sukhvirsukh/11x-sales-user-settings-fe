import z from "zod";

export const agentSchema = z.object({
    name: z.string().min(1, "Agent name is required"),
    url: z.string().min(1, "Agent URL is required"),
    owner: z.string().min(1, "Agent owner is required"),
    startDate: z.date().optional(),
    isDefault: z.boolean(),
    status: z.boolean(),
});