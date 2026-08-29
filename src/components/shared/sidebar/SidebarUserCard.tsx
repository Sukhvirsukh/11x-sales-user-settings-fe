import { cn } from "@/lib/utils";

interface SidebarUserCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  collapsed?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function SidebarUserCard({ name, email, avatarUrl, collapsed = false }: SidebarUserCardProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "absolute bottom-[14px] left-[14px] right-[14px] flex items-center rounded-[6px] border border-border bg-card p-[8px]",
        collapsed && "md:left-2 md:right-2 md:justify-center md:p-1.5 lg:left-[14px] lg:right-[14px] lg:justify-start lg:p-[8px]",
      )}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className="h-[27px] w-[27px] shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full bg-brand-muted text-micro font-semibold text-primary">
          {initials}
        </div>
      )}
      <div className={cn("ml-[8px] min-w-0 flex-1", collapsed && "md:hidden lg:block")}>
        <p className="truncate text-body font-normal leading-[16px] text-foreground">
          {name}
        </p>
        <p className="truncate text-micro leading-[14px] text-subtle">
          {email}
        </p>
      </div>
      <span
        className={cn(
          "ml-[4px] flex h-[16px] w-[16px] items-center justify-center rounded-full bg-muted text-body leading-none text-subtle",
          collapsed && "md:hidden lg:flex",
        )}
      >
        ›
      </span>
    </div>
  );
}
