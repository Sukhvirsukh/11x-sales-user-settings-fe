import z from "zod";

export const knowledgeBaseSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    format: z.enum(["Link", "Doc", "Pdf", "CSV", "Text"], { message: "Format is required" }),
    url: z.string(),
    file: z.instanceof(File).nullable().optional(),
    text: z.string(),
}).superRefine(({ format, url, file, text }, context) => {
    if (format === "Link" && !z.string().url().safeParse(url).success) {
        context.addIssue({
            code: "custom",
            path: ["url"],
            message: url ? "Enter a valid URL" : "URL is required",
        });
    }

    if (["Doc", "Pdf", "CSV"].includes(format) && !file) {
        context.addIssue({
            code: "custom",
            path: ["file"],
            message: `${format} file is required`,
        });
    }

    if (format === "Text" && !text.trim()) {
        context.addIssue({
            code: "custom",
            path: ["text"],
            message: "Text is required",
        });
    }
})

export type KnowledgeBaseFormValues = z.infer<typeof knowledgeBaseSchema>
