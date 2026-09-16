import { format as formatDate } from "date-fns"
import { delay } from "@/lib/utils"
import type { Segament, SegamentFormValues, UserProfile } from "./contactType"
import { segaments, userProfiles } from "./mockContacts"


export async function getUserProfiles(): Promise<UserProfile[]> {
    // const response = await apiFetch<ContactsResponse>("/contacts");
    const response = await delay(2000).then(() => [...userProfiles])

    return response
}


export async function getSegaments(): Promise<Segament[]> {
    // const response = await apiFetch<ContactsResponse>("/contacts/segaments");
    const response = await delay(2000).then(() => [...segaments])

    return response
}


export async function createSegament(values: SegamentFormValues): Promise<Segament> {
    // const response = await apiFetch<Segament>("/contacts/segaments", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(values),
    // });
    await delay(500)

    const nextId = String(
        segaments.reduce((max, segament) => Math.max(max, Number(segament.id) || 0), 0) + 1
    )
    const createdSegament: Segament = {
        id: nextId,
        name: values.name,
        status: "Active",
        createdAt: formatDate(new Date(), "yyyy-MM-dd"),
        activeUsers: 0,
        activeSchedule: formatDate(values.activeSchedule, "yyyy-MM-dd"),
    }

    segaments.push(createdSegament)
    return createdSegament
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


export async function deleteSegaments(ids: string[]): Promise<string[]> {
    // await apiFetch("/contacts/segaments/bulk", { method: "DELETE", body: JSON.stringify({ ids }) });
    await delay(500)

    ids.forEach((id) => {
        const index = segaments.findIndex((segament) => segament.id === id)
        if (index !== -1) segaments.splice(index, 1)
    })

    return ids
}
