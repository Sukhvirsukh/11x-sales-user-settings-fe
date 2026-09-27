import { apiFetch } from "@/lib/api";
import { capitalize } from "@/lib/utils";
import { toPermissionPayload, toPermissionValues } from "@/features/auth/permissions";
import { format as formatDate } from "date-fns";
import type { RoleFormValues, RoleHistoryResponse, RolePayload, RoleResponse, RoleRow } from "./roleHistoryType";

function toRoleRow(role: RoleResponse): RoleRow {
    const date = new Date(role.createdAt);
    const createdAtValue = Number.isNaN(date.getTime()) ? null : date;
    return {
        id: role.id,
        name: role.name,
        email: role.email,
        role: capitalize(role.role),
        permissions: toPermissionValues(role.permissions),
        status: role.status,
        createdAt: createdAtValue ? formatDate(createdAtValue, "MMM d, yyyy") : "-",
        createdAtValue,
    };
}

export async function getRoles(search = "", cursor?: string) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (cursor) params.set("cursor", cursor);
    const query = params.toString();
    const response = await apiFetch<RoleHistoryResponse>(`/admin/users${query ? `?${query}` : ""}`);
    return { ...response, items: response.items.map(toRoleRow) };
}

function toRolePayload(values: RoleFormValues): RolePayload {
    return {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        role: values.role.toUpperCase(),
        permissions: toPermissionPayload(values.permissions),
        status: true,
    };
}

export function createRole(values: RoleFormValues) {
    return apiFetch<unknown>("/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toRolePayload(values)),
    });
}

export function updateRole(id: string, values: RoleFormValues) {
    return apiFetch<unknown>(`/admin/users/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toRolePayload(values)),
    });
}

export function deleteRole(id: string) {
    return apiFetch<unknown>(`/admin/users/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}

export function deleteRoles(ids: string[]) {
    return apiFetch<unknown>("/admin/users/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
    });
}
