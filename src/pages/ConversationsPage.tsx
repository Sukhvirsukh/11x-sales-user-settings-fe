import AppSection from "@/components/design/AppSectoin";
import { CustomTabs } from "@/components/design/CustomTabs";
import PreviewSection from "@/components/design/PreviewSection";
import { ConversationsFilter } from "@/components/shared/conversations";
import { PageHeader } from "@/components/shared/PageHeader";
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
                        <div className="grid w-full min-w-0 grid-cols-1 gap-3.5 lg:grid-cols-[minmax(0,1fr)_194px]">
                            <AppSection className="min-h-0 p-2.5">
                                <Outlet />
                            </AppSection>
                            <ConversationsFilter />
                        </div>
                    </PreviewSection>
                </CustomTabs>
            </PageHeader>
        </section>
    )
}
