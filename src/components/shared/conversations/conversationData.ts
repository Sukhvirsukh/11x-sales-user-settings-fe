export type FilterOption = {
    label: string
    /** Outlined star rating shown on the right of the option. */
    stars?: number
}

export type FilterGroup = {
    title: string
    options: FilterOption[]
}

// Only filters the conversations API supports are offered.
export const filterGroups: FilterGroup[] = [
    {
        title: "Channels",
        options: [{ label: "Website" }, { label: "WhatsApp" }, { label: "Messenger" }, { label: "Instagram" }, { label: "Email" }],
    },
]
