import { SOCIAL_CHANNELS_ENABLED } from "@/config/features";
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
// With only the website chat there is nothing to filter by channel.
export const filterGroups: FilterGroup[] = SOCIAL_CHANNELS_ENABLED ? [
    {
        title: "Channels",
        options: [{ label: "Website" }, { label: "WhatsApp" }, { label: "Messenger" }, { label: "Instagram" }, { label: "Email" }],
    },
] : []
