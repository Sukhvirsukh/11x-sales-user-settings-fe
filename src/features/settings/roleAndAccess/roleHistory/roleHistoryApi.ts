import { apiFetch } from "@/lib/api";
import { capitalize } from "@/lib/utils";
import { format as formatDate } from "date-fns";
import type { RoleFormValues, RolePayload, RoleResponse, RoleRow } from "./roleHistoryType";

function toRoleRow(role: RoleResponse): RoleRow {
    const date = new Date(role.createdAt);
    const createdAtValue = Number.isNaN(date.getTime()) ? null : date;
    return {
        id: role.id,
        name: role.name,
        email: role.email,
        role: capitalize(role.role),
        status: role.status,
        createdAt: createdAtValue ? formatDate(createdAtValue, "MMM d, yyyy") : "-",
        createdAtValue,
    };
}

export async function getRoles(): Promise<RoleRow[]> {
    const response = await apiFetch<Record<string, RoleResponse>>("/admin/users");
    return Object.values(response).map(toRoleRow);
}

function toRolePayload(values: RoleFormValues): RolePayload {
    return {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        role: values.role.toUpperCase(),
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
