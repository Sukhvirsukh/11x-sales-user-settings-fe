import { format as formatDate, parseISO } from "date-fns"
import { agentApiConfigured, agentDownload, agentFetch } from "@/lib/agentApi"
import { dateFormater } from "@/lib/utils"
import type { Report, ReportFormValues } from "./reportType"

interface AgentReport {
    id: string
    source: string
    status: boolean
    createdDate: string
    startDate: string
    endDate: string
}

// Start and end are calendar days (yyyy-MM-dd); parseISO reads them as local dates, so they never shift a day.
const toReport = (report: AgentReport): Report => ({
    ...report,
    createdDate: dateFormater(report.createdDate),
    startDate: dateFormater(parseISO(report.startDate)),
    endDate: dateFormater(parseISO(report.endDate)),
})

export async function getReports(): Promise<Report[]> {
    if (!agentApiConfigured) return []
    const reports = await agentFetch<AgentReport[]>("/reports")
    return reports.map(toReport)
}

export async function addReport(values: ReportFormValues): Promise<Report> {
    const report = await agentFetch<AgentReport>("/reports", {
        method: "POST",
        body: { source: values.source, startDate: formatDate(values.startDate, "yyyy-MM-dd"), endDate: formatDate(values.endDate, "yyyy-MM-dd") },
    })
    return toReport(report)
}

/** Saves the report's figures as a CSV file. */
export function downloadReport(id: string) {
    return agentDownload(`/reports/${encodeURIComponent(id)}/download`)
}
