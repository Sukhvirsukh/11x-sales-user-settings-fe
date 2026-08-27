import {
  LayoutGrid,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Sparkles,
  LifeBuoy,
  MessageCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { useLocation, Link } from "react-router";
import { SidebarUserCard } from "./SidebarUserCard";

interface NavItem {
  icon: ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutGrid className="h-[14px] w-[14px]" />, label: "Overview", href: "/" },
  { icon: <Users className="h-[14px] w-[14px]" />, label: "Contacts", href: "/contacts" },
  { icon: <MessageSquare className="h-[14px] w-[14px]" />, label: "Conversations", href: "/conversations" },
  { icon: <BarChart3 className="h-[14px] w-[14px]" />, label: "Reports", href: "/reports" },
  { icon: <Settings className="h-[14px] w-[14px]" />, label: "Chat settings", href: "/chat-settings" },
  { icon: <Sparkles className="h-[14px] w-[14px]" />, label: "AI training", href: "/ai-training" },
  { icon: <LifeBuoy className="h-[14px] w-[14px]" />, label: "Help & support", href: "/help" },
  { icon: <MessageCircle className="h-[14px] w-[14px]" />, label: "Ask me anything", href: "/ask" },
];

export function Sidebar() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="relative flex h-full w-[200px] shrink-0 flex-col overflow-hidden rounded-[8px] bg-[#e9e9eb] text-[#222225]">
      <div className="mt-[28px] flex items-center gap-[8px] px-[14px]">
        <div className="flex h-[20px] w-[23px] items-center justify-center rounded-[4px] bg-[#2f6df3] text-[9px] font-semibold leading-none text-white">
          V
        </div>
        <span className="text-[13px] font-semibold leading-none text-[#111113]">Vitalb</span>
      </div>

      <nav className="mt-[43px] px-[14px]">
        <ul className="flex flex-col gap-[1px]">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`flex py-[10px] items-center gap-[11px] rounded-[8px] px-[9px] text-[14px] font-normal leading-none transition-colors ${isActive(item.href)
                  ? "border border-[#d6d6d9] bg-white text-[#111113]"
                  : "text-[#222225] hover:bg-white/55"
                  }`}
              >
                {item.icon}
                <span className="">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <SidebarUserCard name="Racheal karl" email="Alex@jco.com" />
    </aside>
  );
}
