import { useMemo, type ComponentType } from "react";
import { OverviewIcon, ContactsIcon, ConversationsIcon, ReportsIcon, ChatConfigurationIcon, AiTrainingIcon, SettingsIcon, AskMeIcon } from '@/assets/sidebar/Icons'
import { usePermissions, type Permission } from "@/features/auth";

export interface NavItem {
    label: string
    icon: ComponentType<{ className?: string }>
    link: string
    /** Capability needed to open this destination — mirrors the route's `handle.permission`. */
    permission: Permission
}

// Navigation Item Structure
export const NAV_ITEMS: NavItem[] = [
    { label: "Overview", icon: OverviewIcon, link: "/", permission: "overview.view" },
    { label: "Contacts", icon: ContactsIcon, link: "/contacts", permission: "contacts.view" },
    { label: "Conversations", icon: ConversationsIcon, link: "/conversations", permission: "conversations.view" },
    { label: "Reports", icon: ReportsIcon, link: "/reports", permission: "reports.view" },
    { label: "Chat configure", icon: ChatConfigurationIcon, link: "/chat-settings", permission: "chatSettings.view" },
    { label: "AI training", icon: AiTrainingIcon, link: "/ai-training", permission: "aiTraining.view" },
    { label: "Settings", icon: SettingsIcon, link: "/settings", permission: "settings.profile.view" },
    { label: "Ask me", icon: AskMeIcon, link: "/ask-me", permission: "askMe.view" },
]

/** Destinations the signed-in role may actually open — the same list the route guard enforces. */
export function useNavItems(): NavItem[] {
    const permissions = usePermissions();
    return useMemo(() => NAV_ITEMS.filter((item) => permissions.has(item.permission)), [permissions]);
}
