import type z from "zod";
import type { storeSchema } from "./storeSchema";

export type StoreFormData = z.infer<typeof storeSchema>;


export interface StoreData extends Record<string, unknown> {
    id?: string;
    name: string;
    url: string;
    owner: string;
    status: boolean;
    isDefault: boolean;
    startDate?: string;
}


export interface StoreResponse {
    data?: unknown;
    stores?: unknown;
    store?: unknown;
}