import { getInitials } from "@/lib/utils";
import { clearAuthToken } from "@/features/auth/authRequest";
import { useAuthStore } from "@/features/auth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

interface SidebarUserCardProps {
    name: string;
    email: string;
    avatarUrl?: string;
    isCollapsed?: boolean;
}

export default function SidebarUserCard({ isCollapsed, name, email, avatarUrl }: SidebarUserCardProps) {
    const initials = getInitials(name);
    const navigate = useNavigate();
    const clearUser = useAuthStore((state) => state.clearUser);

    const handleLogout = () => {
        clearAuthToken();
        clearUser();
        navigate("/sign-in", { replace: true });
    };

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <button
                        type="button"
                        className={`rounded-[10px] bg-blue-50/60 border border-blue-100/80 py-2 px-1.5 flex w-full items-center transition-all ${isCollapsed ? "justify-center p-1.5" : "justify-between"
                            }`}
                        aria-label="Open account menu"
                    />
                }
            >
                <div className="flex items-center gap-2 min-w-0">
                    {avatarUrl ? <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        alt={name}
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
                                {name}
                            </span>
                            <span className="text-sm text-zinc-400 truncate">
                                {email}
                            </span>
                        </div>
                    )}
                </div>

                {!isCollapsed && (
                    <span className="size-4 rounded-full bg-white flex items-center justify-center text-zinc-400 shadow-2xs shrink-0">
                        <ChevronRight className="size-3" />
                    </span>
                )}
            </PopoverTrigger>

            <PopoverContent
                side="top"
                align="start"
                sideOffset={8}
                className="w-[187px] gap-1 rounded-[10px] bg-white p-1.5 shadow-blue"
            >
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-danger transition-colors hover:bg-red-50"
                >
                    <LogOut className="size-4 shrink-0" />
                    <span className="truncate">Log out</span>
                </button>
            </PopoverContent>
        </Popover>
    );
}