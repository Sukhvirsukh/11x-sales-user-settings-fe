import { useMemo, type ComponentType } from "react";
import { OverviewIcon, ContactsIcon, ConversationsIcon, ReportsIcon, ChatConfigurationIcon, AiTrainingIcon, SettingsIcon, AskMeIcon } from '@/assets/sidebar/Icons'
import { usePermissions, type Permission } from "@/features/auth";

export type NavGroup = "workspace" | "agent" | "account"

export const NAV_GROUP_LABELS: Record<NavGroup, string | null> = {
    workspace: "Workspace",
    agent: "AI agent",
    account: null,
}

export interface NavItem {
    label: string
    group: NavGroup
    icon: ComponentType<{ className?: string }>
    link: string
    /** Capability needed to open this destination — mirrors the route's `handle.permission`. */
    permission: Permission
}

// Navigation Item Structure
export const NAV_ITEMS: NavItem[] = [
    { label: "Overview", group: "workspace", icon: OverviewIcon, link: "/", permission: "overview.view" },
    { label: "Conversations", group: "workspace", icon: ConversationsIcon, link: "/conversations", permission: "conversations.view" },
    { label: "Contacts", group: "workspace", icon: ContactsIcon, link: "/contacts", permission: "contacts.view" },
    { label: "Reports", group: "workspace", icon: ReportsIcon, link: "/reports", permission: "reports.view" },
    { label: "AI training", group: "agent", icon: AiTrainingIcon, link: "/ai-training", permission: "aiTraining.view" },
    { label: "Chat setup", group: "agent", icon: ChatConfigurationIcon, link: "/chat-settings", permission: "chatSettings.view" },
    { label: "Ask me", group: "agent", icon: AskMeIcon, link: "/ask-me", permission: "askMe.view" },
    { label: "Settings", group: "account", icon: SettingsIcon, link: "/settings", permission: "settings.profile.view" },
]

/** Destinations the signed-in role may actually open — the same list the route guard enforces. */
export function useNavItems(): NavItem[] {
    const permissions = usePermissions();
    return useMemo(() => NAV_ITEMS.filter((item) => permissions.has(item.permission)), [permissions]);
}
