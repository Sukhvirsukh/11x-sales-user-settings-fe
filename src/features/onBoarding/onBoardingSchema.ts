import z from "zod";

const httpsUrl = z.url({ protocol: /^https$/, hostname: z.regexes.domain });
const isValidUrlSuffix = (value: string) => httpsUrl.safeParse(`https://${value}`).success;

export const addAgentSchema = z.object({
    agentUrl: z.string().trim()
        .min(1, "Agent URL is required")
        .refine(isValidUrlSuffix, "Enter a valid Agent URL without https://"),
    gitUrl: z.string().trim()
        .refine((value) => value === "" || isValidUrlSuffix(value), "Enter a valid Git URL without https://"),
    accessToken: z.string(),
});

export type AddAgentFormData = z.infer<typeof addAgentSchema>;

export const trainAgentSchema = z.object({
    agentName: z.string().trim().min(1, "Agent name is required"),
    language: z.enum(["english", "french", "spanish"]),
    tone: z.string().trim().min(1, "Choose a tone or describe one"),
    unexpectedMoment: z.string().trim().min(1, "Choose a response or describe one"),
    additionalInfo: z.string().trim().min(1, "Additional info is required"),
});

export type TrainAgentFormData = z.infer<typeof trainAgentSchema>;
