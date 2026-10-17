import { format as formatDate } from "date-fns"
import type { SegmentFormValues, SegmentRules, SegmentsResponse, UserProfile } from "./contactType"
import { agentApiConfigured, agentDownload, agentFetch } from "@/lib/agentApi"


/** Shoppers who left their email or phone number in the chat. */
export async function getUserProfiles(): Promise<UserProfile[]> {
    if (!agentApiConfigured) return []
    const profiles = await agentFetch<UserProfile[]>("/contacts")
    return profiles.map((profile) => ({ ...profile, startDate: formatDate(new Date(profile.startDate), "yyyy-MM-dd") }))
}


export async function getSegments(page = 1, search = ""): Promise<SegmentsResponse> {
    if (!agentApiConfigured) return { items: [], page, pageSize: 10, total: 0 }
    const params = new URLSearchParams({ page: String(page) })
    if (search) params.set("search", search)
    return agentFetch<SegmentsResponse>(`/segments?${params.toString()}`)
}


/** How many contacts the rules match right now (shown live while building a segment). */
export async function previewSegment(rules: SegmentRules): Promise<number> {
    const { count } = await agentFetch<{ count: number }>("/segments/preview", {
        method: "POST",
        body: { rules },
        notifyOnError: false,
    })
    return count
}


export async function createSegment(values: SegmentFormValues): Promise<{ id: string; activeUsers: number }> {
    return agentFetch("/segments", {
        method: "POST",
        body: {
            name: values.name,
            activeSchedule: values.activeSchedule ? formatDate(values.activeSchedule, "yyyy-MM-dd") : null,
            rules: values.rules,
        },
    })
}


/** The segment's contacts as a CSV file. */
export function downloadSegment(id: string): Promise<void> {
    return agentDownload(`/segments/${encodeURIComponent(id)}/export`)
}


export async function deleteUserProfiles(ids: string[]): Promise<string[]> {
    await agentFetch("/contacts", { method: "DELETE", body: { ids } })
    return ids
}


/** Deletes one or many segments. */
export async function deleteSegments(ids: string[]): Promise<string[]> {
    await agentFetch("/segments", { method: "DELETE", body: { ids } })
    return ids
}
