import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "./authRequest";

interface AuthStore {
    user: AuthUser | null;
    name: string | null;
    email: string | null;
    setUser: (user: AuthUser | undefined) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            name: null,
            email: null,
            setUser: (user) =>
                set({
                    user: user ?? null,
                    name: user?.name ?? null,
                    email: user?.email ?? null,
                }),
            clearUser: () => set({ user: null, name: null, email: null }),
        }),
        { name: "vitalb.user" },
    ),
);
