import { format as formatDate } from "date-fns"
import type { Segment, SegmentFormValues, SegmentsResponse, UserProfile } from "./contactType"
import { apiFetch } from "@/lib/api"
import { agentApiConfigured, agentFetch } from "@/lib/agentApi"


/** Shoppers who left their email or phone number in the chat. */
export async function getUserProfiles(): Promise<UserProfile[]> {
    if (!agentApiConfigured) return []
    const profiles = await agentFetch<UserProfile[]>("/contacts")
    return profiles.map((profile) => ({ ...profile, startDate: formatDate(new Date(profile.startDate), "yyyy-MM-dd") }))
}


export async function getSegaments(page = 1, search = ""): Promise<SegmentsResponse> {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);

    return apiFetch<SegmentsResponse>(`/contacts/segments?${params.toString()}`);
}


export async function createSegament(values: SegmentFormValues): Promise<Segment> {
    return apiFetch<Segment>("/contacts/segments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: values.name,
            activeSchedule: formatDate(values.activeSchedule, "yyyy-MM-dd"),
        }),
    })
}


export async function deleteUserProfiles(ids: string[]): Promise<string[]> {
    await agentFetch("/contacts", { method: "DELETE", body: { ids } })
    return ids
}


/** Deletes one or many segments through the bulk endpoint. */
export async function deleteSegaments(ids: string[]): Promise<string[]> {
    await apiFetch("/contacts/segments/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
    })

    return ids
}
