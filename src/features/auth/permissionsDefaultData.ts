/**
 * Starting grants per role.
 *
 * TEMPORARY: while the API's `permissions` payload is still incomplete, the sets
 * below **override** it. The auth store loads a known role's set from this file
 * and ignores whatever the response carried, so editing an array here is all it
 * takes to change what that role sees. Only an unrecognised role falls back to
 * the API payload.
 *
 * There is deliberately no `edit` grant below: the UI only ever asks for
 * `create`, and create implies edit, so `create` alone is a section's change
 * capability. (The payload schema still carries an `edit` key — the defaults
 * just leave it false.)
 *
 * Once every response carries a complete, authoritative `permissions`, the
 * override should go and the payload should win again.
 */

import { PERMISSION_ACTIONS } from "./permissionSchema";
import { PERMISSION_GROUPS, type Permission } from "./permissions";

const NO_PERMISSIONS: ReadonlySet<Permission> = new Set();

/**
 * The actions the defaults grant. `edit` is filtered out on purpose — see the
 * file header — so a section's grants below are `view` / `create` / `delete`.
 */
const DEFAULT_ACTIONS = PERMISSION_ACTIONS.filter((action) => action !== "edit");

/**
 * Admin — every capability the defaults grant, written out one per line so a
 * grant can be deleted (or commented out) to test what the role loses in the UI.
 *
 * This is a literal, not a derivation of `PERMISSION_GROUPS`, so editing it here
 * is all that is needed. The trade-off is that it no longer updates itself: when
 * a section is added, add its three grants here too, or Admin silently stops
 * defaulting to it.
 */
export const ALL_PERMISSIONS: readonly Permission[] = [
    // Overview
    "overview.view",
    "overview.create",
    "overview.delete",

    // Contacts
    "contacts.view",
    "contacts.create",
    "contacts.delete",

    // Conversations
    "conversations.view",
    "conversations.create",
    "conversations.delete",

    // Reports
    "reports.view",
    "reports.create",
    "reports.delete",

    // Chat settings
    "chatSettings.view",
    "chatSettings.create",
    "chatSettings.delete",

    // AI training
    "aiTraining.view",
    "aiTraining.create",
    "aiTraining.delete",

    // Ask me
    "askMe.view",
    "askMe.create",
    "askMe.delete",

    // Basic details
    "settings.profile.view",
    "settings.profile.create",
    "settings.profile.delete",

    // Team roles
    "settings.roles.view",
    "settings.roles.create",
    "settings.roles.delete",

    // Plan
    "settings.plan.view",
    "settings.plan.create",
    "settings.plan.delete",

    // Payments
    "settings.payments.view",
    "settings.payments.create",
    "settings.payments.delete",

    // Stores
    "settings.store.view",
    "settings.store.create",
    "settings.store.delete",
];

/** The only Settings section an Editor gets, and only to look at and change. */
const EDITOR_SETTINGS_PERMISSIONS: readonly Permission[] = [
    "settings.profile.view",
    "settings.profile.create",
];

/**
 * Editor — every permission everywhere, except the Settings areas: the whole
 * `settings.*` group is dropped and only basic details (view/create) is added
 * back. So no team roles, plan, payments or store.
 *
 * Still derived from `PERMISSION_GROUPS`, so a new section is picked up here
 * automatically; write it out by hand if you need to edit it the way
 * `ALL_PERMISSIONS` is edited.
 */
export const EDITOR_PERMISSIONS: readonly Permission[] = PERMISSION_GROUPS.filter(
    ({ section }) => !section.startsWith("settings."),
)
    .flatMap(({ section }) => DEFAULT_ACTIONS.map((action) => `${section}.${action}`))
    .concat(EDITOR_SETTINGS_PERMISSIONS);

/**
 * Member — a restricted seat: conversations, generating reports, and their own
 * basic details. `reports.create` is the "generate report" action, and it covers
 * editing a report too.
 */
export const MEMBER_PERMISSIONS: readonly Permission[] = [
    "conversations.view",
    "reports.view",
    "reports.create",
    "settings.profile.view",
    "settings.profile.create",
];

const DEFAULT_PERMISSIONS: Record<string, readonly Permission[]> = {
    ADMIN: ALL_PERMISSIONS,
    EDITOR: EDITOR_PERMISSIONS,
    MEMBER: MEMBER_PERMISSIONS,
};

/** Default grants for an API role, accepting any casing. An unknown role gets none. */
export function getDefaultPermissions(role?: string | null): ReadonlySet<Permission> {
    const permissions = role ? DEFAULT_PERMISSIONS[role.trim().toUpperCase()] : undefined;
    return permissions ? new Set(permissions) : NO_PERMISSIONS;
}

/**
 * Whether this role is one the table knows. A known role with an empty array is
 * still known — it authorises nothing rather than falling through to the API
 * payload, so emptying an array is a valid way to test a role with no access.
 */
export function hasDefaultPermissions(role?: string | null): boolean {
    return Boolean(role && DEFAULT_PERMISSIONS[role.trim().toUpperCase()]);
}
