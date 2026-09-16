import type { z } from "zod"
import type { segamentFormSchema } from "./contactSchema"

export type UserProfile = {
    id: string
    name: string
    email: string
    phoneNo: string
    noOfConversions: number
    startDate: string
}

export type SegamentStatus = "Active" | "Inactive"

export type Segament = {
    id: string
    name: string
    status: SegamentStatus
    createdAt: string
    activeUsers: number
    /** Date the segament is scheduled to become active (yyyy-MM-dd). */
    activeSchedule: string
}

export type SegamentFormValues = z.infer<typeof segamentFormSchema>
