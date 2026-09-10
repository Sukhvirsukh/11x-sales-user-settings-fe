import { apiFetch } from "@/lib/api";
import { dateFormater } from "@/lib/utils";
import { format as formatDate } from "date-fns";
import type { RoleFormValues } from "./roleHistoryTypes";

type RoleRecord = Record<string, unknown>;

type RolesResponse = {
    data?: unknown;
    roles?: unknown;
};

export interface RolePayload {
    name: string;
    email: string;
    role: string;
    status: boolean;
    startDate: string;
}

function asRoleRecords(value: unknown): RoleRecord[] {
    if (Array.isArray(value)) {
        return value.filter((item): item is RoleRecord =>
            typeof item === "object" && item !== null,
        );
    }

    if (typeof value === "object" && value !== null && "roles" in value) {
        return asRoleRecords(value.roles);
    }

    return [];
}

function roleName(value: unknown): string {
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null && "name" in value) {
        return String(value.name ?? "");
    }
    return "";
}

function toDate(value: unknown): Date | null {
    if (value instanceof Date) return value;
    if (typeof value !== "string" && typeof value !== "number") return null;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function toRoleRow(role: RoleRecord): RoleRecord {
    const user = typeof role.user === "object" && role.user !== null
        ? role.user as RoleRecord
        : {};
    const startDateValue = toDate(role.startDate ?? role.createdAt);
    return {
        id: role.id,
        name: role.name ?? user.name ?? "",
        email: role.email ?? user.email ?? "",
        role: roleName(role.role),
        status: role.status ?? (role.isActive === false ? "Inactive" : "Active"),
        startDate: dateFormater(startDateValue),
        startDateValue,
    };
}

export async function getRoles(): Promise<RoleRecord[]> {
    const response = await apiFetch<RolesResponse | RoleRecord[]>("/admin/roles");
    const roles = Array.isArray(response)
        ? response
        : asRoleRecords(response.data ?? response.roles);

    return roles.map(toRoleRow);
}

function toRolePayload(values: RoleFormValues): RolePayload {
    return {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        role: values.role.toUpperCase(),
        status: true,
        startDate: formatDate(values.startDate, "yyyy-MM-dd"),
    };
}

export function createRole(values: RoleFormValues) {
    return apiFetch<unknown>("/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toRolePayload(values)),
    });
}

export function updateRole(id: string, values: RoleFormValues) {
    return apiFetch<unknown>(`/admin/roles/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toRolePayload(values)),
    });
}
export function deleteRole(id: string) {
    return apiFetch<unknown>(`/admin/roles/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}
