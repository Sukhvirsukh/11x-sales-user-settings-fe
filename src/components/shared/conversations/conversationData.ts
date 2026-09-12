export type Conversation = {
    id: number
    name: string
    preview: string
    time: string
    channel: string
}

export const conversations: Conversation[] = [
    { id: 1, name: "Samlesh98", preview: "Why is this not coming through?", time: "12:09 pm", channel: "Website" },
    { id: 2, name: "Kia98", preview: "What is there in your brand?", time: "09:01 pm", channel: "WhatsApp" },
    { id: 3, name: "Michal", preview: "Where is the package?", time: "09:01 pm", channel: "Website" },
]

export const filterGroups = [
    { title: "Channels", options: ["Website", "WhatsApp", "Facebook"] },
    { title: "Ratings", options: ["5 stars", "4 stars", "Less than 3 stars"] },
    { title: "Flags", options: ["10 times and above", "Less than 10 times"] },
    { title: "Assignee", options: ["Admin", "Racheal"] },
]
