import { NavLink } from "react-router"
import { cn } from "@/lib/utils"
import { NAV_GROUP_LABELS, useNavItems, type NavGroup } from "./sideNav"

const GROUPS: NavGroup[] = ["workspace", "agent", "account"]

/** The grouped navigation shared by the desktop sidebar and the mobile drawer. */
export default function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
    const navItems = useNavItems()

    return (
        <nav className="flex flex-col gap-5">
            {GROUPS.map((group) => {
                const items = navItems.filter((item) => item.group === group)
                if (!items.length) return null
                const label = NAV_GROUP_LABELS[group]
                return (
                    <div key={group} className="flex flex-col gap-0.5">
                        {label && (
                            <p className="mb-1 px-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                                {label}
                            </p>
                        )}
                        {items.map((item) => {
                            const Icon = item.icon
                            return (
                                <NavLink
                                    key={item.link}
                                    to={item.link}
                                    end={item.link === "/"}
                                    onClick={onNavigate}
                                    className={({ isActive }) =>
                                        cn(
                                            "group relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-base transition-colors",
                                            "before:absolute before:-left-3 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r-full before:bg-brand before:opacity-0 before:transition-opacity",
                                            isActive
                                                ? "bg-sidebar-active font-medium text-foreground before:opacity-100"
                                                : "text-muted-foreground hover:bg-control-hover hover:text-foreground",
                                        )
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                className={cn(
                                                    "size-[18px] shrink-0 transition-colors",
                                                    isActive ? "text-foreground" : "text-sidebar-navigation-icon group-hover:text-foreground",
                                                )}
                                            />
                                            <span className="truncate">{item.label}</span>
                                        </>
                                    )}
                                </NavLink>
                            )
                        })}
                    </div>
                )
            })}
        </nav>
    )
}
