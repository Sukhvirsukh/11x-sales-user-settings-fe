import { delay } from "@/lib/utils";

import type { Correction, CorrectionFormValues } from "./correctionTypes";
import { mockCorrections } from "./mockCorrections";

export async function getCorrections(): Promise<Correction[]> {
    await delay(1000);
    return mockCorrections.map((correction) => ({ ...correction }));
}

export async function updateCorrection(
    id: string,
    values: CorrectionFormValues,
): Promise<Correction> {
    await delay(500);

    const index = mockCorrections.findIndex((correction) => correction.id === id);
    if (index === -1) throw new Error("Correction not found.");

    const updatedCorrection: Correction = {
        ...mockCorrections[index],
        ...values,
        lastRefresh: new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        }).format(new Date()),
    };
    mockCorrections[index] = updatedCorrection;

    return { ...updatedCorrection };
}

export async function deleteCorrections(ids: string[]): Promise<string[]> {
    await delay(500);

    ids.forEach((id) => {
        const index = mockCorrections.findIndex((correction) => correction.id === id);
        if (index !== -1) mockCorrections.splice(index, 1);
    });

    return ids;
}
