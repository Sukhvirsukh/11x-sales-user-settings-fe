import { delay } from "@/lib/utils"
import type { Report } from "./reportType"

const data: Report[] = [
    {
        source: "Chat for Jan 2026",
        status: true,
        createdDate: "10/02/26",
        endDate: "10/02/26",
    },
    {
        source: "Chat for Feb 2026",
        status: true,
        createdDate: "10/02/26",
        endDate: "10/02/26",
    },
    {
        source: "Chat for Mar 2026",
        status: false,
        createdDate: "10/02/26",
        endDate: "10/02/26",
    },
]


export async function getReports() {
    const response = await delay(2000).then(() => data)

    return response
}


export async function addReport(report: Report) {
    await delay(2000).then(() => data.push(report))

    return report
}