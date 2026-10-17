import { getInitials } from "@/lib/utils";
import { clearAuthToken } from "@/features/auth/authStorage";
import { useAgentStore } from "@/features/agents/agentStore";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/features/auth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import SidebarThemeToggle from "./SidebarThemeToggle";
import InfoModal from "@/components/shared/InfoModal";

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
        useAgentStore.getState().clear();
        queryClient.clear();
        navigate("/sign-in", { replace: true });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <button
                        type="button"
                        className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-control-hover ${isCollapsed ? "justify-center" : ""}`}
                        aria-label="Open account menu"
                    />
                }
            >
                {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="size-8 shrink-0 rounded-full object-cover" />
                ) : (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-display text-[12px] font-semibold text-foreground">
                        {initials}
                    </span>
                )}
                {!isCollapsed && (
                    <>
                        <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-base font-medium text-sidebar-user-name">{name}</span>
                            <span className="truncate text-sm text-sidebar-user-email">{email}</span>
                        </span>
                        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </>
                )}
            </PopoverTrigger>

            <PopoverContent
                side="top"
                align="start"
                sideOffset={8}
                className="w-(--anchor-width) min-w-56 max-w-[calc(100vw-2rem)] gap-0 overflow-hidden rounded-xl border border-border bg-popover! p-0 shadow-[var(--elevation-2)] ring-0!"
            >
                <div className="flex items-center justify-start gap-3 border-b border-border px-3 py-3 text-center">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="size-10 shrink-0 rounded-full border border-section-border object-cover" />
                    ) : (
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-display text-base font-semibold text-foreground">
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
                        className="w-full justify-start gap-2.5 px-3 py-1.5! text-foreground dark:text-muted-foreground! dark:hover:bg-muted! dark:hover:text-muted-foreground!"
                    >
                        <Settings className="size-4 shrink-0 text-muted-foreground" />
                        Settings
                    </Button>
                    <SidebarThemeToggle />
                    <InfoModal
                        trigger={
                            <Button
                                type="button"
                                variant="bare"
                                size="sm"
                                className="w-full justify-start gap-2.5 px-3 py-1.5! text-danger hover:bg-danger-surface"
                            >
                                <LogOut className="size-4 shrink-0" />
                                Log out
                            </Button>
                        }
                        cancelLabel="Cancel"
                        confirmLabel="Logout"
                        onOpenChange={setOpen}
                        onConfirm={handleLogout}
                        title="Log out?"
                        description="You can sign back in at any time."
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
