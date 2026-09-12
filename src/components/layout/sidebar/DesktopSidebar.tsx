import { NavLink } from "react-router"
import { NAV_ITEMS } from "./sideNav"
import SidebarUserCard from "./SidebarUserCard"
import { isSidebarHidden } from "./isSidebarHidden"
import { useAuthStore } from "@/features/auth"

export default function DesktopSidebar() {
  const isCollapsed = false
  const name = useAuthStore((state) => state.name)
  const email = useAuthStore((state) => state.email)

  if (isSidebarHidden(location.pathname)) {
    return null;
  }

  return (
    <aside
      className={`relative hidden flex-col justify-between rounded-[10px] border border-section-border bg-sidebar p-4 shadow-blue transition-all duration-300 md:flex ${isCollapsed ? "w-[72px]" : "w-[187px]"
        }`}
    >
      {/* Top Header & Toggle */}
      <div>
        <div className="flex items-center justify-between mb-10 px-1">
          <div className="flex items-center gap-2.5">
            {/* Logo Box */}
            <div className="size-5 shrink-0 rounded-md bg-primary" />
            {!isCollapsed && (
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Vitalb
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label}
                to={item.link}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-base transition-all ${isActive
                    ? "border border-active-border bg-active-bg font-medium text-foreground shadow-2xs"
                    : "border border-transparent text-foreground hover:bg-active-bg"
                  } ${isCollapsed ? "justify-center px-0" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`size-5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <SidebarUserCard
        name={name ?? "Account"}
        email={email ?? ""}
        isCollapsed={isCollapsed}
      />
    </aside>
  )
}
