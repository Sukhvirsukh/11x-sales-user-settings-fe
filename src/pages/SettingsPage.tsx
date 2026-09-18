import { CustomTabs } from "@/components/design/CustomTabs";
import PreviewSection from "@/components/design/PreviewSection";
import { PageHeader } from "@/components/shared/PageHeader";
import { Outlet, useLocation, useNavigate } from "react-router";
import { usePermissions, type Permission } from "@/features/auth";

/** Each tab names the capability that unlocks it — the same one its route declares. */
const settingsTabs: { id: string; label: string; path: string; permission: Permission }[] = [
    { id: "role-n-access", label: "Role & access", path: "/settings/role-n-access", permission: "settings.profile.view" },
    { id: "plan", label: "Plan", path: "/settings/plan", permission: "settings.plan.view" },
    { id: "payments", label: "Payments", path: "/settings/payments", permission: "settings.payments.view" },
    { id: "store", label: "Store", path: "/settings/store", permission: "settings.store.view" },
];

export default function SettingsPage() {
    const location = useLocation();
    const permissions = usePermissions();
    const mainTabs = settingsTabs.filter((tab) => permissions.has(tab.permission));

    const activeTab = mainTabs.find((tab) => location.pathname === tab.path)?.id ?? mainTabs[0]?.id ?? "";

    const navigate = useNavigate();

    const handleTabChange = (tabId: string) => {
        const tab = mainTabs.find((t) => t.id === tabId);
        if (tab) {
            navigate(tab.path);
        }
    };

    const content = (
        <PreviewSection>
            <Outlet />
        </PreviewSection>
    );

    return (
        <section className="h-full min-w-0">
            <PageHeader
                title="Settings"
                subtitle="Configure your chat behavior, integration defaults, and account profile."
            >
                {/* A single reachable tab has nothing to switch between, so the bar is dropped
                    and the tab's content renders on its own. */}
                {mainTabs.length > 1 ? (
                    <CustomTabs
                        tabs={mainTabs.map(({ id, label }) => ({ id, label }))}
                        value={activeTab}
                        onValueChange={handleTabChange}
                        listClassName="pl-[4px]"
                        className="p-0!"
                    >
                        {content}
                    </CustomTabs>
                ) : content}
            </PageHeader>
        </section>
    );
}
