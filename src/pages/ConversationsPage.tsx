import { CustomTabs } from "@/components/design/CustomTabs";
import PreviewSection from "@/components/design/PreviewSection";
import { ConversationsFilter, ConversationsToolbar } from "@/components/shared/conversations";
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
                        {/*
                         * Below `lg` the panel takes an open thread out of its card and lays the
                         * list and the thread in the same grid cell as the toolbar row, so the
                         * cell grows to the thread and the thread paints over that row. The grid
                         * drops out of the layout (`contents`) there, which is what lets those
                         * blocks reach the row; from `lg` up it is a two-column grid again, the
                         * panel's card beside the filter.
                         */}
                        <div className="flex w-full min-w-0 flex-col items-start gap-3.5 max-lg:grid max-lg:grid-cols-1">
                            <ConversationsToolbar />
                            <div className="grid w-full min-w-0 grid-cols-1 gap-3.5 max-lg:contents lg:grid-cols-[minmax(0,1fr)_194px] 2xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
                                <Outlet />
                                <ConversationsFilter className="max-lg:hidden" />
                            </div>
                        </div>
                    </PreviewSection>
                </CustomTabs>
            </PageHeader>
        </section>
    )
}
