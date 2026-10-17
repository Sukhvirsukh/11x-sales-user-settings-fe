

export interface Report extends Record<string, unknown> {
    id: string,
    source: string,
    status: boolean,
    createdDate: string,
    startDate: string,
    endDate: string,
}


export type ReportFormValues = {
    source: string,
    startDate: Date,
    endDate: Date
}