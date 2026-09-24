import type { Correction } from "./correctionTypes";

export const mockCorrections: Correction[] = [
    {
        id: "correction-1",
        name: "Do you have anything in black shoe?",
        corrections: "Yes, we have exactly in navy bluish black",
        status: "Active",
        createDate: "10/02/26",
        lastRefresh: "10/02/26",
    },
    {
        id: "correction-2",
        name: "Do you have anything in a larger size?",
        corrections: "Yes, this product is available in sizes up to XXL",
        status: "Active",
        createDate: "10/02/26",
        lastRefresh: "10/02/26",
    },
];
