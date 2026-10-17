import { BrandLogo } from "@/components/brand/Brand"
import { StoreDropdown } from "@/components/shared/StoreDropdown"
import { useAuthStore } from "@/features/auth"
import SidebarNav from "./SidebarNav"
import SidebarUserCard from "./SidebarUserCard"
import { isSidebarHidden } from "./isSidebarHidden"

export default function DesktopSidebar() {
  const name = useAuthStore((state) => state.name)
  const email = useAuthStore((state) => state.email)

  if (isSidebarHidden(location.pathname)) {
    return null;
  }

  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex h-16 items-center px-5">
        <BrandLogo />
      </div>

      <div className="px-3 pb-4">
        <p className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Store</p>
        <StoreDropdown variant="sidebar" />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <SidebarNav />
      </div>

      <div className="border-t border-border p-3">
        <SidebarUserCard name={name ?? "Account"} email={email ?? ""} />
      </div>
    </aside>
  )
}
