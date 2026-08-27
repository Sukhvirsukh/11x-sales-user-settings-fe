import { ChevronRight } from "lucide-react";

interface UserProfileProps {
  name: string;
  email: string;
  avatarUrl?: string;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserProfile({
  name,
  email,
  avatarUrl,
  className = "",
}: UserProfileProps) {
  const initials = getInitials(name);

  return (
    <div className={`flex items-center gap-3 border-t border-[#EDEDF0] px-4 py-4 ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className="h-9 w-9 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DBEAFE] text-sm font-semibold text-[#2563EB]">
          {initials}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#18181B]">{name}</p>
        <p className="truncate text-xs text-[#8A8A94]">{email}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#8A8A94]" />
    </div>
  );
}
