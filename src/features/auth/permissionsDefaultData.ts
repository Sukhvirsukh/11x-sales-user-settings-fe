/**
 * Starting grants per role.
 *
 * TEMPORARY: the API reports `role` but does not send a `permissions` payload
 * yet, so `usePermissions` falls back to the sets below whenever a response
 * carries no grants. Once every response includes `permissions`, this file and
 * its one caller can go.
 *
 * Edit the sets here to change what a role gets by default — nothing else in the
 * app encodes role-based access.
 */

import { PERMISSION_ACTIONS } from "./permissionSchema";
import { PERMISSION_GROUPS, type Permission } from "./permissions";

const NO_PERMISSIONS: ReadonlySet<Permission> = new Set();

/** Every capability in the catalog. */
export const ALL_PERMISSIONS: readonly Permission[] = PERMISSION_GROUPS.flatMap(({ section }) =>
    PERMISSION_ACTIONS.map((action) => `${section}.${action}`),
);

/** The only Settings section an Editor gets, and only to look at and change. */
const EDITOR_SETTINGS_PERMISSIONS: readonly Permission[] = [
    "settings.profile.view",
    "settings.profile.edit",
];

/**
 * Editor — every permission everywhere, except the Settings areas: the whole
 * `settings.*` group is dropped and only basic details (view/edit) is added back.
 * So no team roles, plan, payments or store.
 */
export const EDITOR_PERMISSIONS: readonly Permission[] = PERMISSION_GROUPS.filter(
    ({ section }) => !section.startsWith("settings."),
)
    .flatMap(({ section }) => PERMISSION_ACTIONS.map((action) => `${section}.${action}`))
    .concat(EDITOR_SETTINGS_PERMISSIONS);

/**
 * Member — a restricted seat: conversations, generating reports, and their own
 * basic details. `reports.create` is the "generate report" action, and it brings
 * `reports.edit` with it because the permissions table grants those together.
 */
export const MEMBER_PERMISSIONS: readonly Permission[] = [
    "conversations.view",
    "reports.view",
    "reports.create",
    "reports.edit",
    "settings.profile.view",
    "settings.profile.edit",
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
