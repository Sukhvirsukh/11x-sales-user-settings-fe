import type { ReactNode } from "react";
import { SidebarMenuButton } from "@/components/shared/sidebar";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 py-6">
      <div className="flex min-w-0 items-start gap-3">
        <SidebarMenuButton />
        <div>
          <h1 className="m-0 text-display font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-subtitle text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
