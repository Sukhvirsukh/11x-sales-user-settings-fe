import { Link, useLocation, Outlet } from "react-router";
import { PageHeader } from "@/components/shared/PageHeader";

const mainTabs = [
  { id: "knowledge-base", label: "Knowledge base", path: "/ai-training/knowledge-base" },
  { id: "corrections", label: "Corrections", path: "/ai-training/corrections" },
  { id: "prompt-tools", label: "Prompt tools", path: "/ai-training/prompt-tools" },
];

export function AiTrainingPage() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <section className="h-full min-w-0 pt-[11px] text-foreground">
      <PageHeader
        title="Ai training"
        subtitle="Train your AI to better understand your business"
        chatTitle="Knowledge Base Chat"
        chatPlaceholder="Ask about your knowledge base..."
      >
        <div className="flex items-center gap-[12px] pl-[4px]">
          {mainTabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              className={`flex h-[23px] items-center justify-center rounded-[5px] px-[7px] text-micro font-medium leading-none transition-colors ${isActive(tab.path)
                ? "border border-sidebar-border bg-card text-foreground shadow-sm"
                : "text-foreground hover:text-foreground"
                }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <Outlet />
      </PageHeader>
    </section>
  );
}
