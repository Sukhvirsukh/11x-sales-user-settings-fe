/**
 * Dynamic access control.
 *
 * The backend owns the policy: a user carries a `permissions` payload shaped as
 * an array of section objects, for example
 *
 * ```json
 * [
 *   { "overview": { "view": true } },
 *   { "contacts": { "view": true } },
 *   { "settings.roles": { "view": true, "edit": true } }
 * ]
 * ```
 *
 * `PERMISSION_GROUPS` below is the catalog of sections and actions the UI knows
 * how to render and check — it is *not* a grant. Nothing here hardcodes which
 * role may do what: the grants always come from the API, so any action can be
 * given to any role without touching this file. Components ask a capability
 * question (`useCan("settings.roles.create")`) and routes declare what they need
 * in `handle.permission`, which `RouteGuard` enforces.
 */

import { PERMISSION_ACTIONS, type PermissionPayload, type PermissionValues } from "./permissionSchema";

/** A capability, named `section.action` — e.g. `overview.view`, `settings.roles.edit`. */
export type Permission = string;

export type PermissionGroup = {
    /** Key used in the API payload; may itself contain dots (`settings.roles`). */
    section: string;
    /** Human label for the permissions table. */
    label: string;
};

/**
 * Every section in the app — the one place a new page is declared. Each section
 * offers the full set of `PERMISSION_ACTIONS`, so the permissions table has a
 * checkbox in every cell and any action can be granted to any role.
 */
export const PERMISSION_GROUPS: readonly PermissionGroup[] = [
    { section: "overview", label: "Overview" },
    { section: "contacts", label: "Contacts" },
    { section: "conversations", label: "Conversations" },
    { section: "reports", label: "Reports" },
    { section: "chatSettings", label: "Chat settings" },
    { section: "aiTraining", label: "AI training" },
    { section: "askMe", label: "Ask me" },
    { section: "settings.profile", label: "Basic details" },
    { section: "settings.roles", label: "Team roles" },
    { section: "settings.plan", label: "Plan" },
    { section: "settings.payments", label: "Payments" },
    { section: "settings.store", label: "Stores" },
];

/** Ordered landing pages, most preferred first. */
const HOME_ROUTES: { path: string; permission: Permission }[] = [
    { path: "/", permission: "overview.view" },
    { path: "/conversations", permission: "conversations.view" },
    { path: "/reports", permission: "reports.view" },
    { path: "/contacts", permission: "contacts.view" },
    { path: "/chat-settings", permission: "chatSettings.view" },
    { path: "/ai-training", permission: "aiTraining.view" },
    { path: "/ask-me", permission: "askMe.view" },
    { path: "/settings/role-n-access", permission: "settings.profile.view" },
];

const NO_PERMISSIONS: ReadonlySet<Permission> = new Set();

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Reads the API payload (an array of section objects, or a single nested object)
 * into `{ section: { action: boolean } }`. Sections the catalog does not know
 * are kept, so a newer backend never loses grants when saved from the role form.
 * Anything malformed is ignored — the policy fails closed.
 */
export function parsePermissionValues(raw: unknown): PermissionValues {
    const values: PermissionValues = {};
    const sources = Array.isArray(raw) ? raw : isPlainObject(raw) ? [raw] : [];

    for (const source of sources) {
        if (!isPlainObject(source)) continue;
        for (const [section, actions] of Object.entries(source)) {
            if (!isPlainObject(actions)) continue;
            const sectionValues = values[section] ?? {};
            for (const [action, granted] of Object.entries(actions)) {
                if (typeof granted === "boolean") sectionValues[action] = granted;
            }
            values[section] = sectionValues;
        }
    }

    return values;
}

/** Every catalog section/action set to `false` — the base of an editable map. */
function emptyPermissionValues(): PermissionValues {
    const values: PermissionValues = {};

    for (const { section: key } of PERMISSION_GROUPS) {
        const section: Record<string, boolean> = {};
        for (const action of PERMISSION_ACTIONS) section[action] = false;
        values[key] = section;
    }

    return values;
}

/**
 * Turns a flat capability set (`["overview.view"]`) into the form's nested map,
 * seeding every catalog checkbox — used to prefill the role form with the
 * selected role's defaults.
 */
export function permissionValuesFrom(permissions: Iterable<Permission>): PermissionValues {
    const values = emptyPermissionValues();

    for (const permission of permissions) {
        const separator = permission.lastIndexOf(".");
        if (separator <= 0) continue;
        const section = values[permission.slice(0, separator)];
        if (section) section[permission.slice(separator + 1)] = true;
    }

    return values;
}

/**
 * A fresh editable copy for the role form: every catalog section/action present
 * (so the table has a checkbox for each) overlaid with what the API returned.
 */
export function toPermissionValues(savedPermissions?: unknown): PermissionValues {
    const saved = parsePermissionValues(savedPermissions);
    const values = emptyPermissionValues();

    // Preserve grants the catalog does not render yet, so saving never drops them.
    for (const [section, actions] of Object.entries(saved)) {
        values[section] = { ...values[section], ...actions };
    }

    return values;
}

/** `{ overview: { view: true } }` → `[{ overview: { view: true } }]` — the API's array shape. */
export function toPermissionPayload(values: PermissionValues): PermissionPayload {
    return Object.entries(values).map(([section, actions]) => ({ [section]: actions }));
}

/**
 * Capabilities the user holds, flattened to `section.action` keys. A missing or
 * malformed payload grants nothing — `usePermissions` falls back to the role
 * defaults from `permissionsDefaultData.ts` in that case.
 */
export function getPermissions(savedPermissions?: unknown): ReadonlySet<Permission> {
    const permissions: Permission[] = [];

    for (const [section, actions] of Object.entries(parsePermissionValues(savedPermissions))) {
        for (const [action, granted] of Object.entries(actions)) {
            if (granted) permissions.push(`${section}.${action}`);
        }
    }

    return permissions.length > 0 ? new Set(permissions) : NO_PERMISSIONS;
}

/** Where to send a user: their most preferred reachable page. */
export function getHomeRoute(permissions: ReadonlySet<Permission>): string {
    return HOME_ROUTES.find(({ permission }) => permissions.has(permission))?.path ?? "/";
}

/** Narrows arbitrary route `handle` data to a capability name. */
export function isPermission(value: unknown): value is Permission {
    return typeof value === "string" && value.includes(".");
}
