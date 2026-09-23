export type CorrectionStatus = "Active" | "Inactive";

export type Correction = {
    id: string;
    name: string;
    corrections: string;
    status: CorrectionStatus;
    createDate: string;
    lastRefresh: string;
};

export type CorrectionFormValues = Pick<Correction, "name" | "corrections" | "status">;
