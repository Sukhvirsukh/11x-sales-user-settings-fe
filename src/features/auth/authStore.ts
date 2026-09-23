import { create } from "zustand";
import type { AuthStore, AuthUser } from "./authTypes";
import { getPermissions, type Permission } from "./permissions";
import { getDefaultPermissions, hasDefaultPermissions } from "./permissionsDefaultData";

const LEGACY_AUTH_STORE_STORAGE_KEY = "vitalb.user";

function resolvePermissions(user?: AuthUser | null): Permission[] {
    if (!user) return [];

    // TEMPORARY: a known role's set in `permissionsDefaultData.ts` overrides the
    // API payload, so editing that file is enough to change what a role can do.
    // An unrecognised role has no set and falls back to whatever the API sent.
    if (hasDefaultPermissions(user.role)) return [...getDefaultPermissions(user.role)];

    return [...getPermissions(user.permissions)];
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
