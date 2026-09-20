/** A single headline metric on the Overview dashboard. */
export interface OverviewStat {
    /** Human-readable name, e.g. "Total replies". */
    label: string;
    /** Raw value, e.g. 40000. */
    value: number;
    /** Server-formatted value for display, e.g. "40k". */
    displayValue: string;
}

/** Headline metrics the Overview cards are built from. */
export interface OverviewStats {
    totalReplies: OverviewStat;
    disputeChat: OverviewStat;
    /** Share of resolved chats, as a percentage (0–100). */
    resolutionRate: OverviewStat;
}

/** Response of `GET /overview`. */
export interface OverviewResponse {
    stats: OverviewStats;
}
