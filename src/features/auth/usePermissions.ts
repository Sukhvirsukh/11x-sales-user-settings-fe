import { useMemo } from "react";
import { useAuthStore } from "./authStore";
import type { Permission } from "./permissions";

/**
 * Capabilities of the signed-in user, resolved once by `authStore.setUser`.
 *
 * This is the single read path for every check in the app — the route guard, the
 * sidebar, the settings tabs and every `useCan` call. The reference is stable
 * while its inputs are unchanged, so it is safe to depend on from `useMemo` when
 * filtering lists.
 */
export function usePermissions(): ReadonlySet<Permission> {
    const permissions = useAuthStore((state) => state.permissions);
    return useMemo(() => new Set(permissions), [permissions]);
}

/**
 * One capability check, e.g. `useCan("settings.store.create")`. Reads as a
 * permission question so UI affordances stay decoupled from role names.
 */
export function useCan(permission: Permission): boolean {
    return usePermissions().has(permission);
}
