import { Navigate, Outlet, useLocation, useMatches, type UIMatch } from "react-router";
import ForbiddenPage from "@/pages/ForbiddenPage";
import { getHomeRoute, isPermission, type Permission } from "./permissions";
import { usePermissions, useRole } from "./usePermissions";

/** A route opts into protection by declaring `handle: { permission: "..." }`. */
export type RouteHandle = { permission?: Permission };

/**
 * Deepest match that declares a permission wins, so a parent route's declaration
 * covers its children and a child can still tighten the requirement.
 */
function requiredPermission(matches: UIMatch[]): Permission | undefined {
    for (let index = matches.length - 1; index >= 0; index -= 1) {
        const handle = matches[index]?.handle as RouteHandle | undefined;
        if (isPermission(handle?.permission)) return handle.permission;
    }
    return undefined;
}

/**
 * Renders a protected branch only when the current role holds the permission the
 * matched route asks for — a URL typed by hand is checked exactly like a link click.
 *
 * A blocked visit falls back to the role's own home route. If that home is itself
 * blocked (unknown role, misconfigured policy) `ForbiddenPage` renders instead of
 * redirecting again, so a blocked route can never bounce or loop.
 */
export default function RouteGuard() {
    const role = useRole();
    const permissions = usePermissions();
    const matches = useMatches();
    const { pathname } = useLocation();
    const required = requiredPermission(matches);

    if (!required || permissions.has(required)) return <Outlet />;

    const home = getHomeRoute(role);
    return pathname === home ? <ForbiddenPage /> : <Navigate to={home} replace />;
}
