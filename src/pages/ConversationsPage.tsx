import AppSection from "@/components/design/AppSectoin";
import { CustomTabs } from "@/components/design/CustomTabs";
import PreviewSection from "@/components/design/PreviewSection";
import { ConversationsFilter, ConversationsToolbar } from "@/components/shared/conversations";
import { PageHeader } from "@/components/shared/PageHeader";
import { useConversationChatStore } from "@/features/conversations/conversationChatStore";
import { cn } from "@/lib/utils";
import { Outlet, useLocation, useNavigate } from "react-router";

const mainTabs = [
    { id: "active-chats", label: "Active chats", path: "/conversations/active-chats" },
    { id: "escalated", label: "Escalated", path: "/conversations/escalated" },
    { id: "assigned-to-me", label: "Assigned", path: "/conversations/assigned-to-me" },
    { id: "archived", label: "Archived", path: "/conversations/archived" },
];

export default function ConversationsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const activeTab = mainTabs.find((tab) => location.pathname === tab.path)?.id ?? mainTabs[0].id;
    const isThreadOpen = useConversationChatStore((state) => state.isThreadOpen);

    function handleTabChange(tabId: string) {
        const tab = mainTabs.find((item) => item.id === tabId);
        if (tab) navigate(tab.path);
    }

    return (
        <section className="h-full min-w-0">
            <PageHeader
                title="Conversations"
                subtitle="Track ongoing customer chats, agent responsiveness, and automated resolutions."
            >
                <CustomTabs
                    tabs={mainTabs.map(({ id, label }) => ({ id, label }))}
                    value={activeTab}
                    onValueChange={handleTabChange}
                    listClassName="pl-[4px]"
                    className="p-0!"
                >
                    <PreviewSection>
                        {/*
                         * Below `lg` an open thread overlaps the whole section, the toolbar row
                         * included, so both share a single grid cell: the cell grows to the
                         * thread's height and the panel — opaque while a thread is open — paints
                         * over the row. From `lg` up this is a plain column again.
                         */}
                        <div className="flex w-full min-w-0 flex-col items-start gap-3.5 max-lg:grid max-lg:grid-cols-1">
                            <ConversationsToolbar />
                            <div className={cn(
                                "grid w-full min-w-0 grid-cols-1 gap-3.5 lg:grid-cols-[minmax(0,1fr)_194px] 2xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]",
                                isThreadOpen
                                    ? "max-lg:col-start-1 max-lg:row-start-1 max-lg:bg-preview-section-background"
                                    : "max-lg:col-start-1 max-lg:row-start-2",
                            )}>
                                <AppSection className="min-h-0 p-2.5">
                                    <Outlet />
                                </AppSection>
                                <ConversationsFilter className="max-lg:hidden" />
                            </div>
                        </div>
                    </PreviewSection>
                </CustomTabs>
            </PageHeader>
        </section>
    )
}
