import { format as formatDate } from "date-fns"
import { delay } from "@/lib/utils"
import type { Segment, SegmentFormValues, SegmentsResponse, UserProfile } from "./contactType"
import { userProfiles } from "./mockContacts"
import { apiFetch } from "@/lib/api"


export async function getUserProfiles(): Promise<UserProfile[]> {
    // const response = await apiFetch<ContactsResponse>("/contacts");
    const response = await delay(2000).then(() => [...userProfiles])

    return response
}


export async function getSegaments(search = "", cursor?: string): Promise<SegmentsResponse> {
    const params = new URLSearchParams({});
    if (search) params.set("search", search);
    if (cursor) params.set("cursor", cursor);

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
    // await apiFetch("/contacts/bulk", { method: "DELETE", body: JSON.stringify({ ids }) });
    await delay(500)

    ids.forEach((id) => {
        const index = userProfiles.findIndex((profile) => profile.id === id)
        if (index !== -1) userProfiles.splice(index, 1)
    })

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
