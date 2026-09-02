
import { OverviewIcon, ContactsIcon, ConversationsIcon, ReportsIcon, ChatConfigurationIcon, AiTrainingIcon, SettingsIcon, AskMeIcon } from '@/assets/sidebar/Icons'




// Navigation Item Structure
export const NAV_ITEMS = [
    { label: "Overview", icon: OverviewIcon, active: true, link: "/" },
    { label: "Contacts", icon: ContactsIcon, link: "/contacts" },
    { label: "Conversations", icon: ConversationsIcon, link: "/conversations" },
    { label: "Reports", icon: ReportsIcon, link: "/reports" },
    { label: "Chat configure", icon: ChatConfigurationIcon, link: "/chat-settings" },
    { label: "AI training", icon: AiTrainingIcon, link: "/ai-training" },
    { label: "Settings", icon: SettingsIcon, link: "/settings" },
    { label: "Ask me", icon: AskMeIcon, link: "/ask-me" },
]
