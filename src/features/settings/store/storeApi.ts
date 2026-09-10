import { apiFetch } from "@/lib/api";
import { dateFormater } from "@/lib/utils";
import type { StoreData, StoreResponse } from "./storeType";

function formatStore(store: StoreData): StoreData {
    const date = store.startDate ? new Date(store.startDate) : null;

    return {
        ...store,
        startDate: date && !Number.isNaN(date.getTime()) ? dateFormater(date) : "",
        startDateValue: date,
    };
}

export async function getStores(): Promise<StoreData[]> {
    const response = await apiFetch<StoreResponse | StoreData[]>("/admin/stores");
    const stores = Array.isArray(response) ? response : response.data ?? response.stores ?? [];

    return Array.isArray(stores) ? stores.map(formatStore) : [];
}

export function createStore(store: Omit<StoreData, "id">) {
    return apiFetch<StoreResponse>("/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(store),
    });
}

export function updateStore(id: string, store: Partial<StoreData>) {
    return apiFetch<StoreResponse>(`/admin/stores/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(store),
    });
}

export function deleteStore(id: string) {
    return apiFetch<StoreResponse>(`/admin/stores/${id}`, {
        method: "DELETE",
    });
}
