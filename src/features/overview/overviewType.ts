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

/** A single month in the chat-to-sale trend. */
export interface ChatToSalePoint {
    /** Month label, e.g. "Jan". */
    month: string;
    /** Conversions for that month, e.g. 19800. */
    value: number;
}

/** Chat-to-sale conversion panel on the Overview dashboard. */
export interface ChatToSaleConversion {
    /** Panel title, e.g. "Total Chat-to-Sale conversion". */
    title: string;
    /** Range the series covers, e.g. "This month". */
    range: string;
    series: ChatToSalePoint[];
}

/** Response of `GET /overview`. */
export interface OverviewResponse {
    stats: OverviewStats;
    chatToSaleConversion: ChatToSaleConversion;
}
