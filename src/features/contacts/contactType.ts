import type { z } from "zod"
import type { segmentFormSchema } from "./contactSchema"

export type UserProfile = {
    id: string
    name: string
    email: string
    phoneNo: string
    noOfConversions: number
    startDate: string
}

export type SegmentStatus = "Active" | "Inactive"

export type Segment = {
    id: string
    name: string
    status: SegmentStatus
    createdAt: string
    activeUsers: number
    /** Date the segment is scheduled to become active (yyyy-MM-dd). */
    activeSchedule: string
}

export type SegmentFormValues = z.infer<typeof segmentFormSchema>
