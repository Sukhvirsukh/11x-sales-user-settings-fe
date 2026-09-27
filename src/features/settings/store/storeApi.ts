import { apiFetch } from "@/lib/api";
import { dateFormater } from "@/lib/utils";
import type { StoreData, StoreListResponse, StoreResponse } from "./storeType";

function formatStore(store: StoreData): StoreData {
    const date = store.startDate ? new Date(store.startDate) : null;

    return {
        ...store,
        startDate: date && !Number.isNaN(date.getTime()) ? dateFormater(date) : "",
        startDateValue: date,
    };
}

export async function getStores(search = "", cursor?: string) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (cursor) params.set("cursor", cursor);
    const query = params.toString();
    const response = await apiFetch<StoreListResponse>(`/admin/stores${query ? `?${query}` : ""}`);
    return { ...response, items: response.items.map(formatStore) };
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

export function deleteStores(ids: string[]) {
    return apiFetch<unknown>("/admin/stores/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
    });
}
