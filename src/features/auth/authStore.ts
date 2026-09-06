import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthStore } from "./authTypes";

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            name: null,
            email: null,
            role: null,
            setUser: (user) =>
                set({
                    user: user ?? null,
                    name: user?.name ?? null,
                    email: user?.email ?? null,
                    role: user?.role ?? null,
                }),
            clearUser: () => set({ user: null, name: null, email: null, role: null }),
        }),
        { name: "vitalb.user" },
    ),
);
