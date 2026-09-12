import { getInitials } from "@/lib/utils";
import { clearAuthToken } from "@/features/auth/authStorage";
import { useAuthStore } from "@/features/auth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronRight, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

interface SidebarUserCardProps {
    name: string;
    email: string;
    avatarUrl?: string;
    isCollapsed?: boolean;
}

export default function SidebarUserCard({ isCollapsed, name, email, avatarUrl }: SidebarUserCardProps) {
    const initials = getInitials(name);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const clearUser = useAuthStore((state) => state.clearUser);

    const handleLogout = () => {
        clearAuthToken();
        clearUser();
        navigate("/sign-in", { replace: true });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <button
                        type="button"
                        className={`rounded-[10px] bg-table-header border border-primary/20 py-2 px-1.5 flex w-full items-center transition-all ${isCollapsed ? "justify-center p-1.5" : "justify-between"
                            }`}
                        aria-label="Open account menu"
                    />
                }
            >
                <div className="flex items-center gap-2 min-w-0">
                    {avatarUrl ? <img
                        src={avatarUrl}
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
                            <span className="truncate text-foreground">
                                {name}
                            </span>
                            <span className="truncate text-sm text-muted-foreground">
                                {email}
                            </span>
                        </div>
                    )}
                </div>

                {!isCollapsed && (
                    <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground shadow-2xs">
                        <ChevronRight className="size-3" />
                    </span>
                )}
            </PopoverTrigger>

            <PopoverContent
                side="right"
                align="start"
                sideOffset={8}
                className="w-max max-w-[calc(100vw-2rem)] gap-0 overflow-hidden rounded-[10px] border-0 bg-popover! p-0 shadow-blue ring-0!"
            >
                <div className="flex items-center justify-center gap-3 bg-light px-3 py-3 text-center">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="size-10 shrink-0 rounded-full border border-section-border object-cover" />
                    ) : (
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-section-border bg-brand-muted text-sm font-semibold text-primary">
                            {initials}
                        </div>
                    )}
                    <div className="min-w-0 space-y-0.5 text-left">
                        <p className="wrap-break-words text-sm font-semibold text-foreground">{name}</p>
                        <p className="break-all text-xs text-muted-foreground">{email}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-1 p-2">
                    <Button
                        type="button"
                        variant="bare"
                        size="sm"
                        onClick={() => {
                            setOpen(false);
                            navigate("/settings");
                        }}
                        className="w-full justify-start gap-2.5 px-3 py-2.5 text-foreground"
                    >
                        <Settings className="size-4 shrink-0 text-muted-foreground" />
                        Settings
                    </Button>
                    <Button
                        type="button"
                        variant="bare"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start gap-2.5 px-3 py-2.5 text-danger hover:bg-danger-light"
                    >
                        <LogOut className="size-4 shrink-0" />
                        Log out
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
