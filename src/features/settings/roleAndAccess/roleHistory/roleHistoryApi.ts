import { apiFetch } from "@/lib/api";
import { capitalize } from "@/lib/utils";
import { agentPath } from "@/features/agents/agentStore";
import { permissionValuesFrom } from "@/features/auth/permissions";
import { getDefaultPermissions } from "@/features/auth/permissionsDefaultData";
import { format as formatDate } from "date-fns";
import type { RoleFormValues, RoleRow } from "./roleHistoryType";

// The store's team (11xSales backend: /agents/:agentId/members). Roles come
// from the backend's role matrix, so a member's permissions follow their role.

interface ApiMember {
    userId: string;
    name: string;
    email: string;
    role: "owner" | "editor" | "member";
    isActive: boolean;
    invitedAt: string | null;
    acceptedAt: string | null;
    createdAt: string;
}

// The dashboard's permission sets are keyed ADMIN / EDITOR / MEMBER.
const DASHBOARD_ROLE: Record<ApiMember["role"], string> = { owner: "ADMIN", editor: "EDITOR", member: "MEMBER" };

function toRoleRow(member: ApiMember): RoleRow {
    const date = new Date(member.createdAt);
    const createdAtValue = Number.isNaN(date.getTime()) ? null : date;
    return {
        id: member.userId,
        name: member.name,
        email: member.email,
        role: capitalize(member.role),
        permissions: permissionValuesFrom(getDefaultPermissions(DASHBOARD_ROLE[member.role])),
        status: !member.isActive ? "inactive" : member.acceptedAt ? "active" : "pending",
        createdAt: createdAtValue ? formatDate(createdAtValue, "MMM d, yyyy") : "-",
        createdAtValue,
    };
}

export async function getRoles(): Promise<RoleRow[]> {
    const members = await apiFetch<ApiMember[]>(agentPath("/members"));
    return members.map(toRoleRow);
}

/** Invites someone to the store's team; new people get an email to set their password. */
export function createRole(values: RoleFormValues) {
    return apiFetch<ApiMember>(agentPath("/members"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            role: values.role.toLowerCase(),
        }),
    });
}

/** Changes a teammate's role (their name and email are their own to edit). */
export function updateRole(id: string, values: RoleFormValues) {
    return apiFetch<ApiMember>(agentPath(`/members/${encodeURIComponent(id)}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: values.role.toLowerCase() }),
    });
}

export function deleteRole(id: string) {
    return apiFetch<unknown>(agentPath(`/members/${encodeURIComponent(id)}`), { method: "DELETE" });
}

export async function deleteRoles(ids: string[]) {
    await Promise.all(ids.map((id) => deleteRole(id)));
}
