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
      className={`hidden md:flex flex-col justify-between p-4 bg-white border border-blue-100/70 rounded-[10px] shadow-blue transition-all duration-300 relative ${isCollapsed ? "w-[72px]" : "w-[187px]"
        }`}
    >
      {/* Top Header & Toggle */}
      <div>
        <div className="flex items-center justify-between mb-10 px-1">
          <div className="flex items-center gap-2.5">
            {/* Logo Box */}
            <div className="size-5 rounded-md bg-blue-600 shrink-0" />
            {!isCollapsed && (
              <span className="font-semibold text-lg text-zinc-900 tracking-tight">
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
                    ? "text-zinc-900 bg-blue-50/60 border font-medium border-blue-100/80 shadow-2xs"
                    : "hover:bg-blue-50/60 hover:text-zinc-900 border border-transparent"
                  } ${isCollapsed ? "justify-center px-0" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`size-4 shrink-0 ${isActive ? "text-blue-600" : "text-zinc-900"
                        }`}
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
