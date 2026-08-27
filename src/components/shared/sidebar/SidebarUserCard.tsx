interface SidebarUserCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function SidebarUserCard({ name, email, avatarUrl }: SidebarUserCardProps) {
  const initials = getInitials(name);

  return (
    <div className="absolute bottom-[14px] left-[14px] flex right-[14px] items-center rounded-[6px] border border-[#e0e0e2] bg-white p-[8px]">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className="h-[27px] w-[27px] shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[9px] font-semibold text-[#2563eb]">
          {initials}
        </div>
      )}
      <div className="ml-[8px] min-w-0 flex-1">
        <p className="truncate text-[14px] font-normal leading-[16px] text-[#1b1b1f]">
          {name}
        </p>
        <p className="truncate text-[11px] leading-[14px] text-[#8b8b94]">
          {email}
        </p>
      </div>
      <span className="ml-[4px] flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#f3f3f4] text-[15px] leading-none text-[#8b8b94]">›</span>
    </div>
  );
}
