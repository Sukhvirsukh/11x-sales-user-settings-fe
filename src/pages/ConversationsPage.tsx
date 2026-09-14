import AppCard from "@/components/design/AppCard";
import { CustomTabs } from "@/components/design/CustomTabs";
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

    const activeTab = mainTabs.find((tab) => location.pathname === tab.path)?.id ?? mainTabs[0].id;

    const navigate = useNavigate();

    const handleTabChange = (tabId: string) => {
        const tab = mainTabs.find((t) => t.id === tabId);
        if (tab) {
            navigate(tab.path);
        }
    };

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
                    <div className="h-full pt-2.5 pb-5">
                        <div className="grid h-full w-full gap-3 xl:grid-cols-[minmax(0,1fr)_250px]">
                            <AppCard shadow>
                                <Outlet />
                            </AppCard>
                            <ConversationsFilter />
                        </div>
                    </div>
                </CustomTabs>
            </PageHeader>
        </section>
    )
}
