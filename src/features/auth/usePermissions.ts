import { useMemo } from "react";
import { useAuthStore } from "./authStore";
import { getPermissions, type Permission } from "./permissions";
import { getDefaultPermissions } from "./permissionsDefaultData";

/**
 * Capabilities of the signed-in user. The API payload wins whenever it carries
 * grants; otherwise the role's defaults apply (the API does not send a
 * `permissions` payload yet).
 *
 * This is the single read path for every check in the app — the route guard, the
 * sidebar, the settings tabs and every `useCan` call. The reference is stable
 * while its inputs are unchanged, so it is safe to depend on from `useMemo` when
 * filtering lists.
 */
export function usePermissions(): ReadonlySet<Permission> {
    const payload = useAuthStore((state) => state.user?.permissions);
    const role = useAuthStore((state) => state.user?.role ?? state.role);

    return useMemo(() => {
        const granted = getPermissions(payload);
        return granted.size > 0 ? granted : getDefaultPermissions(role);
    }, [payload, role]);
}

/**
 * One capability check, e.g. `useCan("settings.store.edit")`. Reads as a
 * permission question so UI affordances stay decoupled from role names.
 */
export function useCan(permission: Permission): boolean {
    return usePermissions().has(permission);
}
