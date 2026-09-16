import { CustomTabs } from "@/components/design/CustomTabs";
import PreviewSection from "@/components/design/PreviewSection";
import { PageHeader } from "@/components/shared/PageHeader";
import { Outlet, useLocation, useNavigate } from "react-router";

const mainTabs = [
    { id: "user-profile-details", label: "User profile details", path: "/contacts/user-profile-details" },
    { id: "segaments", label: "Segaments", path: "/contacts/segaments" }
];

export default function ContactPage() {
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
                title="Contact"
                subtitle="View, manage, and organize all your user contacts and customer profiles."
            >
                <CustomTabs
                    tabs={mainTabs.map(({ id, label }) => ({ id, label }))}
                    value={activeTab}
                    onValueChange={handleTabChange}
                    listClassName="pl-[4px]"
                    className="p-0!"
                >

                    <PreviewSection>
                        <Outlet />
                    </PreviewSection>
                </CustomTabs>
            </PageHeader>
        </section>
    );
}
