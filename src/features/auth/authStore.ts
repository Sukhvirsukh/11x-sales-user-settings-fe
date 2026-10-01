import { create } from "zustand";
import type { AuthStore } from "./authTypes";
import { getPermissions } from "./permissions";

const LEGACY_AUTH_STORE_STORAGE_KEY = "vitalb.user";

// Remove profile data written by versions that persisted the Zustand store.
// The JWT remains independently managed by authStorage.ts.
try {
    window.localStorage.removeItem(LEGACY_AUTH_STORE_STORAGE_KEY);
} catch {
    // In-memory auth still works when storage is unavailable.
}

const ONBOARDING_STORAGE_KEY = "vitalb.isOnBoarding";

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    name: null,
    email: null,
    role: null,
    phone: null,
    isOnBoarding: true,
    permissions: [],
    setUser: (user) =>
        set({
            user: user ?? null,
            name: user?.name ?? null,
            email: user?.email ?? null,
            role: user?.role ?? null,
            phone: user?.phone ?? null,
            // Temporary source of truth until backend onboarding is connected.
            isOnBoarding: !!user && localStorage.getItem(ONBOARDING_STORAGE_KEY) !== "false",
            permissions: [...getPermissions(user?.permissions)],
        }),
    completeOnboarding: () => {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, "false");
        set({ isOnBoarding: false });
    },
    clearUser: () => set({ user: null, name: null, email: null, role: null, phone: null, isOnBoarding: false, permissions: [] }),
}));
