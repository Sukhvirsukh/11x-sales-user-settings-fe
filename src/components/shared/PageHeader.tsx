import { type ReactNode } from "react";
import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { ChatBox } from "@/components/shared/chatBox";
import { SidebarMenuButton } from "@/components/shared/sidebar";
import { useChatboxStore } from "@/pages/aiTraining/stores";
import { StoreDropdown } from "./StoreDropdown";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  children: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  backTo,
  children,
}: PageHeaderProps) {
  const { isOpen, setIsOpen } = useChatboxStore();

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarMenuButton />
          {backTo && (
            <Link
              to={backTo}
              aria-label="Go back"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          )}
          <div className="min-w-0">
            <h1 className="text-display font-semibold tracking-normal text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-[2px] text-subtitle text-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-[9px] md:mt-[12px] md:w-auto md:shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-[35px] min-w-[90px] flex-1 items-center justify-center rounded-[9px] border border-foreground bg-card text-body font-medium leading-none text-foreground md:flex-none"
          >
            Test chat
          </button>
          <StoreDropdown />
        </div>
      </header>

      {/* Content area with ChatBox */}
      <div className="mt-4 flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4 md:mt-[33px] lg:min-h-0 lg:flex-row lg:items-stretch">
        <div className="min-w-0 flex-1 flex min-h-0 flex-col">
          {children}
        </div>

        {isOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              aria-label="Close test chat"
              onClick={() => setIsOpen(false)}
            />
            <div className="fixed inset-x-3 bottom-3 top-3 z-50 overflow-hidden rounded-[8px] border border-border bg-card shadow-md lg:static lg:inset-auto lg:z-auto lg:w-[min(360px,38%)] lg:max-w-[400px] lg:shrink-0 lg:self-stretch">
              <ChatBox
                onClose={() => setIsOpen(false)}
                className="h-full"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
