import { create } from "zustand";
import type { AuthStore, AuthUser } from "./authTypes";
import { getPermissions, type Permission } from "./permissions";
import { getDefaultPermissions } from "./permissionsDefaultData";

const LEGACY_AUTH_STORE_STORAGE_KEY = "vitalb.user";

function resolvePermissions(user?: AuthUser | null): Permission[] {
    if (!user) return [];

    // A present backend payload is authoritative, including an explicit empty
    // payload. Role defaults are only for responses that omit permissions.
    return user.permissions == null
        ? [...getDefaultPermissions(user.role)]
        : [...getPermissions(user.permissions)];
}

// Remove profile data written by versions that persisted the Zustand store.
// The JWT remains independently managed by authStorage.ts.
try {
    window.localStorage.removeItem(LEGACY_AUTH_STORE_STORAGE_KEY);
} catch {
    // In-memory auth still works when storage is unavailable.
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    name: null,
    email: null,
    role: null,
    phone: null,
    permissions: [],
    setUser: (user) =>
        set({
            user: user ?? null,
            name: user?.name ?? null,
            email: user?.email ?? null,
            role: user?.role ?? null,
            phone: user?.phone ?? null,
            permissions: resolvePermissions(user),
        }),
    clearUser: () => set({ user: null, name: null, email: null, role: null, phone: null, permissions: [] }),
}));
