import { Navigate, Outlet, useLocation, useMatches, type UIMatch } from "react-router";
import ForbiddenPage from "@/pages/ForbiddenPage";
import { getHomeRoute, isPermission, type Permission } from "./permissions";
import { usePermissions } from "./usePermissions";

/** A route opts into protection by declaring `handle: { permission: "..." }`. */
export type RouteHandle = { permission?: Permission };

/**
 * Deepest match that declares a permission wins, so a parent route's declaration
 * covers its children and a child can still tighten the requirement.
 * An invalid declaration returns null so it cannot leave the route unprotected.
 */
function requiredPermission(matches: UIMatch[]): Permission | null | undefined {
    return matches
        .map(({ handle }) =>
            handle && typeof handle === "object" && "permission" in handle
                ? isPermission(handle.permission) ? handle.permission : null
                : undefined,
        )
        .findLast((permission) => permission !== undefined);
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
    const permissions = usePermissions();
    const matches = useMatches();
    const { pathname } = useLocation();
    const required = requiredPermission(matches);


    if (required === null) return <ForbiddenPage />;
    if (required === undefined || permissions.has(required)) return <Outlet />;

    const home = getHomeRoute(permissions);
    return pathname === home ? <ForbiddenPage /> : <Navigate to={home} replace />;
}
