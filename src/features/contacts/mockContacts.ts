import type { Segament, UserProfile } from "./contactType"

export const userProfiles: UserProfile[] = [
    {
        id: "1",
        name: "John Doe",
        email: "Dh7oG@example.com",
        phoneNo: "1234567890",
        noOfConversions: 10,
        startDate: "2022-01-01"
    },
    {
        id: "2",
        name: "Jane Doe",
        email: "Dh7oG@example.com",
        phoneNo: "1234567890",
        noOfConversions: 10,
        startDate: "2022-01-01"
    }
]

export const segaments: Segament[] = [
    {
        id: "1",
        name: "User that chats over 10 conversations",
        status: "Active",
        createdAt: "2022-01-01",
        activeUsers: 10,
        activeSchedule: "2022-01-01"
    },
    {
        id: "2",
        name: "User that chats over 10 conversations",
        status: "Active",
        createdAt: "2022-01-01",
        activeUsers: 10,
        activeSchedule: "2022-01-01"
    }
]
