import z from "zod";


export const requiredFieldsSchema = z.object({
    aiAgentName: z.string().trim().min(1, "Agent name is required"),
    welcomeMessage: z.string().trim().min(1, "Welcome message is required"),
    placeholderMessage: z.string().trim().min(1, "Placeholder message is required"),
    primaryColor: z
        .string()
        .regex(/^#(?:[\dA-Fa-f]{3}|[\dA-Fa-f]{6})$/, "Enter a valid hex color"),
    notificationColor: z
        .string()
        .regex(/^#(?:[\dA-Fa-f]{3}|[\dA-Fa-f]{6})$/, "Enter a valid hex color"),
});