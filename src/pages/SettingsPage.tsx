import { CustomTabs } from "@/components/design/CustomTabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { Outlet, useLocation, useNavigate } from "react-router";

const mainTabs = [
    { id: "role-n-access", label: "Role & access", path: "/settings/role-n-access" },
    { id: "plan", label: "Plan", path: "/settings/plan" },
    { id: "payments", label: "Payments", path: "/settings/payments" },
    { id: "store", label: "Store", path: "/settings/store" },
];

export default function SettingsPage() {
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
                title="Settings"
                subtitle="Configure your chat behavior, integration defaults, and account profile."
            >
                <CustomTabs
                    tabs={mainTabs.map(({ id, label }) => ({ id, label }))}
                    value={activeTab}
                    onValueChange={handleTabChange}
                    listClassName="pl-[4px]"
                    className="p-0!"
                >
                    <Outlet />
                </CustomTabs>
            </PageHeader>
        </section>
    );
}