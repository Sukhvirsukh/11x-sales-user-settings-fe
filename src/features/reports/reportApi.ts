import { dateFormater, delay } from "@/lib/utils"
import type { Report, ReportFormValues } from "./reportType"

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


export async function addReport(values: ReportFormValues) {
    const report: Report = {
        source: values.source,
        status: true,
        createdDate: dateFormater(new Date()),
        endDate: dateFormater(values.endDate),
    }

    await delay(2000)
    data.push(report)

    return report
}