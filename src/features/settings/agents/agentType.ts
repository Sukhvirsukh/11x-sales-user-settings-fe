import type z from "zod";
import type { agentSchema } from "./agentSchema";

export type AgentFormData = z.infer<typeof agentSchema>;


export interface AgentData extends Record<string, unknown> {
    id?: string;
    name: string;
    url: string;
    owner: string;
    status: boolean;
    isDefault: boolean;
    startDate?: string;
}


export interface AgentResponse {
    data?: unknown;
    agents?: unknown;
    agent?: unknown;
}

export interface AgentListResponse {
    items: AgentData[];
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
    hasNext: boolean;
    hasPrev: boolean;
    nextPage: number;
    prevPage: number;
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
}