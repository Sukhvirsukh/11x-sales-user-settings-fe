

export interface Report extends Record<string, unknown> {
    source: string,
    status: boolean,
    createdDate: string,
    endDate: string,
}


export type ReportFormValues = {
    source: string,
    startDate: Date,
    endDate: Date
}