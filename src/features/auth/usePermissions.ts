import { useMemo } from "react";
import { useAuthStore } from "./authStore";
import { getPermissions, normalizeRole, type AppRole, type Permission } from "./permissions";

/** The signed-in user's role, normalized. `null` until a role is known (fails closed). */
export function useRole(): AppRole | null {
    const role = useAuthStore((state) => state.user?.role ?? state.role);
    return useMemo(() => normalizeRole(role), [role]);
}

/**
 * Capabilities of the signed-in user. The reference is stable while the role is
 * unchanged, so it is safe to depend on from `useMemo` when filtering lists.
 */
export function usePermissions(): ReadonlySet<Permission> {
    const role = useRole();
    return useMemo(() => getPermissions(role), [role]);
}

/**
 * One capability check, e.g. `useCan("settings.store.manage")`. Reads as a
 * permission question so UI affordances stay decoupled from role names.
 */
export function useCan(permission: Permission): boolean {
    return usePermissions().has(permission);
}
