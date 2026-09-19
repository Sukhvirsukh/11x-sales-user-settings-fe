import { z } from "zod";

/**
 * Actions a section can expose, in the order the permissions table renders its
 * columns. Adding one here is enough to offer it — the catalog in
 * `permissions.ts` decides which sections actually support it.
 */
export const PERMISSION_ACTIONS = ["view", "create", "edit", "delete"] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

/** A section's actions, e.g. `{ view: true, edit: false }`. */
export const permissionActionsSchema = z.record(z.string(), z.boolean());

/**
 * The API payload: an array of section objects.
 *
 * ```json
 * [
 *   { "overview": { "view": true } },
 *   { "settings.roles": { "view": true, "create": true, "edit": false, "delete": false } }
 * ]
 * ```
 */
export const permissionPayloadSchema = z.array(
  z.record(z.string(), permissionActionsSchema),
);

export type PermissionPayload = z.infer<typeof permissionPayloadSchema>;

/**
 * The same grants folded into one map, keyed by section — the shape the role
 * role form edits before converting them to the API payload.
 */
export const permissionValuesSchema = z.record(
  z.string(),
  permissionActionsSchema,
);

export type PermissionValues = z.infer<typeof permissionValuesSchema>;
