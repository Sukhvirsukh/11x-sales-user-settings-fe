import { create } from "zustand";

interface SidebarState {
  isMobileOpen: boolean;
  isCollapsed: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
  toggleCollapsed: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isMobileOpen: false,
  isCollapsed: false,
  openMobile: () => set({ isMobileOpen: true }),
  closeMobile: () => set({ isMobileOpen: false }),
  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
