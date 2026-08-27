import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 py-6">
      <div>
        <h1 className="m-0 text-2xl font-bold text-[#18181B]">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[#6B6B76]">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
