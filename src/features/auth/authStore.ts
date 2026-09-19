import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthStore, AuthUser } from "./authTypes";
import { getPermissions, type Permission } from "./permissions";
import { getDefaultPermissions } from "./permissionsDefaultData";

function resolvePermissions(user?: AuthUser | null): Permission[] {
    if (!user) return [];

    // A present backend payload is authoritative, including an explicit empty
    // payload. Role defaults are only for responses that omit permissions.
    return user.permissions == null
        ? [...getDefaultPermissions(user.role)]
        : [...getPermissions(user.permissions)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAuthUser(value: unknown): value is AuthUser {
    return isRecord(value) && typeof value.name === "string";
}

function persistedString(value: unknown): string | null {
    return typeof value === "string" ? value : null;
}

function persistedPermissions(value: unknown): Permission[] | undefined {
    return Array.isArray(value) && value.every((permission) => typeof permission === "string")
        ? value
        : undefined;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
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
        }),
        {
            name: "vitalb.user",
            merge: (persistedState, currentState): AuthStore => {
                if (!isRecord(persistedState)) return currentState;

                const user = isAuthUser(persistedState.user) ? persistedState.user : null;

                return {
                    ...currentState,
                    user,
                    name: persistedString(persistedState.name),
                    email: persistedString(persistedState.email),
                    role: persistedString(persistedState.role),
                    phone: persistedString(persistedState.phone),
                    // Resolve older persisted sessions that predate this field.
                    permissions: persistedPermissions(persistedState.permissions) ?? resolvePermissions(user),
                };
            },
        },
    ),
);
