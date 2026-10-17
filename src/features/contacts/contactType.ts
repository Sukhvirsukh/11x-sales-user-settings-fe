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

/** Who a segment covers; mirrors the agent service's segment rules. */
export type SegmentRules = {
    /** everyone, customers (bought through chat) or leads (haven't bought yet) */
    who: "everyone" | "customers" | "leads"
    /** Chatted within the last N days (null = any time). */
    activeWithinDays: number | null
    /** Asked about this topic in the chat. */
    askedAbout: string | null
    /** Only people who agreed to marketing emails. */
    consentOnly: boolean
}

export type Segment = {
    id: string
    name: string
    status: SegmentStatus
    createdAt: string
    activeUsers: number
    rules: SegmentRules
    /** Date the segment becomes active (yyyy-MM-dd), or null for straight away. */
    activeSchedule: string | null
}

export type SegmentsResponse = {
    items: Segment[]
    page: number
    pageSize: number
    total: number
}

export type SegmentFormValues = z.infer<typeof segmentFormSchema>
