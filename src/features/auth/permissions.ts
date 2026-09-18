/**
 * Role-based access control — the whole policy, declared once.
 *
 * Nothing in the app branches on a role string. Components ask a capability
 * question (`useCan("settings.roles.create")`), and routes declare what they need
 * in `handle.permission`, which `RouteGuard` enforces. Adding a capability, or
 * moving one between roles, is a single edit here — the navigation, the settings
 * tabs and the route guard all read from this map.
 */

/** Workspace roles. `ADMIN` owns the account and is never assignable from the role form. */
export const APP_ROLES = ["ADMIN", "EDITOR", "MEMBER"] as const;

export type AppRole = (typeof APP_ROLES)[number];

/** Every capability in the app, named `area.action`. */
export const PERMISSIONS = [
    // top-level pages
    "overview.view",
    "contacts.view",
    "conversations.view",
    "reports.view",
    "chatSettings.view",
    "aiTraining.view",
    "askMe.view",
    // settings
    "settings.profile.view",
    "settings.roles.view",
    "settings.roles.edit",
    "settings.roles.create",
    "settings.roles.delete",
    "settings.plan.view",
    "settings.payments.view",
    "settings.store.view",
    "settings.store.manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * - `ADMIN` — the owner: every capability, billing and role management included.
 * - `EDITOR` — runs day-to-day work on every page; the whole team role history belongs
 *   to the owner, so inside Settings an editor sees only their own basic details.
 * - `MEMBER` — a restricted seat: conversations and reports, plus their basic details.
 */
const ROLE_PERMISSIONS: Record<AppRole, readonly Permission[]> = {
    ADMIN: PERMISSIONS,
    EDITOR: [
        "overview.view",
        "contacts.view",
        "conversations.view",
        "reports.view",
        "chatSettings.view",
        "aiTraining.view",
        "askMe.view",
        "settings.profile.view",
    ],
    MEMBER: ["conversations.view", "reports.view", "settings.profile.view"],
};

/** Where each role lands — after sign-in, and after a blocked route visit. */
const HOME_ROUTE_BY_ROLE: Record<AppRole, string> = {
    ADMIN: "/",
    EDITOR: "/",
    MEMBER: "/conversations",
};

const NO_PERMISSIONS: ReadonlySet<Permission> = new Set();

const ROLE_PERMISSION_SETS = new Map<AppRole, ReadonlySet<Permission>>(
    APP_ROLES.map((role) => [role, new Set<Permission>(ROLE_PERMISSIONS[role])]),
);

/** Accepts the API's casing and padding (`"admin"`, `" Editor "`); unknown values become `null`. */
export function normalizeRole(role?: string | null): AppRole | null {
    const value = role?.trim().toUpperCase();
    return (APP_ROLES as readonly string[]).includes(value ?? "") ? (value as AppRole) : null;
}

/** Capabilities of a role. An unknown or missing role gets none — the policy fails closed. */
export function getPermissions(role?: string | null): ReadonlySet<Permission> {
    const normalized = normalizeRole(role);
    return (normalized && ROLE_PERMISSION_SETS.get(normalized)) || NO_PERMISSIONS;
}

export function can(role: string | null | undefined, permission: Permission): boolean {
    return getPermissions(role).has(permission);
}

export function getHomeRoute(role?: string | null): string {
    const normalized = normalizeRole(role);
    return normalized ? HOME_ROUTE_BY_ROLE[normalized] : "/";
}

/** Narrows arbitrary route `handle` data to a known permission. */
export function isPermission(value: unknown): value is Permission {
    return typeof value === "string" && (PERMISSIONS as readonly string[]).includes(value);
}
