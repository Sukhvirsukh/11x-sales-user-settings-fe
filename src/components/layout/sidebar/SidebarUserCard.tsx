import { getInitials } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface SidebarUserCardProps {
    name: string;
    email: string;
    avatarUrl?: string;
    isCollapsed?: boolean;
}

export default function SidebarUserCard({ isCollapsed, name, email, avatarUrl }: SidebarUserCardProps) {
    const initials = getInitials(name);

    return (<div
        className={`rounded-[10px] bg-blue-50/60 border border-blue-100/80 py-2 px-1.5 flex items-center transition-all ${isCollapsed ? "justify-center p-1.5" : "justify-between"
            }`}
    >
        <div className="flex items-center gap-2 min-w-0">
            {avatarUrl ? <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Racheal karl"
                className="size-8 rounded-full object-cover shrink-0"
            />
                :
                <div className="flex h-[27px] w-[27px] font-normal shrink-0 items-center justify-center rounded-full bg-brand-muted text-micro text-primary">
                    {initials}
                </div>
            }
            {!isCollapsed && (
                <div className="flex flex-col text-left min-w-0">
                    <span className="font-semibold text-zinc-800 truncate">
                        {
                            name
                        }
                    </span>
                    <span className="text-sm text-zinc-400 truncate">
                        {email}
                    </span>
                </div>
            )}
        </div>
        {!isCollapsed && (
            <button className="size-4 rounded-full bg-white flex items-center justify-center text-zinc-400 shadow-2xs shrink-0">
                <ChevronRight className="size-3" />
            </button>
        )}
    </div>
    )
}
