import { useLocation, useNavigate, Outlet } from "react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { CustomTabs } from "@/components/design/CustomTabs";

const mainTabs = [
    { id: "knowledge-base", label: "Knowledge base", path: "/ai-training/knowledge-base" },
    { id: "corrections", label: "Corrections", path: "/ai-training/corrections" },
    { id: "prompt-tools", label: "Prompt tools", path: "/ai-training/prompt-tools" },
];

export function AiTrainingPage() {
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
                title="Ai training"
                subtitle="Train your AI to better understand your business"
            >
                <CustomTabs
                    tabs={mainTabs.map(({ id, label }) => ({ id, label }))}
                    value={activeTab}
                    onValueChange={handleTabChange}
                    listClassName="pl-[4px]"
                    className="p-0!"
                >
                    <div className="flex flex-col items-start gap-3.5 pb-5 pt-2">
                        <div className="flex p-4 flex-col items-start gap-3.5 rounded-[10px] border border-blue-100/70 bg-white shadow-blue w-full overflow-hidden">
                            <Outlet />
                        </div>
                    </div>
                </CustomTabs>
            </PageHeader>
        </section>
    );
}
