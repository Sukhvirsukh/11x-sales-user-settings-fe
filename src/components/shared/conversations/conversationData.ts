export type Conversation = {
    id: number
    name: string
    preview: string
    time: string
    channel: string
    email: string
    phone: string
    location: string
    shareUrl: string
}

export const conversations: Conversation[] = [
    {
        id: 1,
        name: "Samlesh98",
        preview: "Why this is not coming through?",
        time: "12:09 pm",
        channel: "Website",
        email: "Samlesh98@gmail.com",
        phone: "79765XXXXXX",
        location: "India",
        shareUrl: "www.hio.com",
    },
    {
        id: 2,
        name: "Kia98",
        preview: "What's there in your brand?",
        time: "09:01 pm",
        channel: "WhatsApp",
        email: "kia98@gmail.com",
        phone: "79765XXXXXX",
        location: "India",
        shareUrl: "www.hio.com",
    },
    {
        id: 3,
        name: "Michal",
        preview: "Where is the package?",
        time: "09:01 pm",
        channel: "Website",
        email: "michal@gmail.com",
        phone: "79765XXXXXX",
        location: "India",
        shareUrl: "www.hio.com",
    },
]

export type ConversationMessage = {
    id: string
    content: string
    sender: "bot" | "user"
}

export const conversationMessages: ConversationMessage[] = [
    { id: "1", content: "Welcome to newhie! How can I help you today?", sender: "bot" },
    { id: "2", content: "What's there in your brand", sender: "user" },
    { id: "3", content: "Hi there! Welcome to newhie! How can I help you today?", sender: "bot" },
]

export type FilterOption = {
    label: string
    /** Outlined star rating shown on the right of the option. */
    stars?: number
}

export type FilterGroup = {
    title: string
    options: FilterOption[]
}

export const filterGroups: FilterGroup[] = [
    { title: "Channels", options: [{ label: "Website" }, { label: "WhatsApp" }, { label: "Facebook" }] },
    { title: "Ratings", options: [{ label: "5 Stars", stars: 5 }, { label: "4 Stars & less", stars: 4 }] },
    { title: "Flags", options: [{ label: "Less than 10 times" }, { label: "More than 10 times" }] },
    { title: "Assignee", options: [{ label: "Admin" }, { label: "Racheal" }, { label: "Kiran" }] },
]
