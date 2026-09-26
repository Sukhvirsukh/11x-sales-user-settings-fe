import type { z } from "zod";
import type { roleFormSchema } from "./roleHistorySchema";
import type { PermissionPayload, PermissionValues } from "@/features/auth/permissionSchema";

export type RoleFormValues = z.infer<typeof roleFormSchema>;

export type RolePermissions = PermissionValues;

export interface RoleResponse {
    id: string;
    email: string;
    phone: string | null;
    name: string;
    role: string;
    status: boolean;
    permissions?: unknown;
    ownerId: string;
    createdAt: string;
}

export interface RoleHistoryResponse {
    items: RoleResponse[];
    nextCursor: string | null;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
}

export interface RoleRow extends Record<string, unknown> {
    permissions?: RolePermissions;
    id: string;
    name: string;
    email: string;
    role: string;
    status: boolean;
    createdAt: string;
    createdAtValue: Date | null;
}

export interface RolePayload {
    permissions: PermissionPayload;
    name: string;
    email: string;
    role: string;
    status: boolean;
}
