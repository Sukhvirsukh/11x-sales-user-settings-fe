import z from "zod";

export const knowledgeBaseSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    url: z.string().min(1, { message: "URL is required" }).url({ message: "Enter a valid URL" }),
})

export type KnowledgeBaseFormValues = z.infer<typeof knowledgeBaseSchema>

