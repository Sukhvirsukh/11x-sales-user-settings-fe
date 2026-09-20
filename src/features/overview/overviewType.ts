/** A single month in a monthly trend series. */
export interface TrendPoint {
    /** Month label, e.g. "Jan". */
    month: string;
    /** Value for that month, e.g. 19800. */
    value: number;
}

/** A titled monthly trend, with the range it covers. */
export interface TrendPanel {
    /** Panel title, e.g. "Total Chat-to-Sale conversion". */
    title: string;
    /** Range the series covers, e.g. "This month". */
    range: string;
    series: TrendPoint[];
}

/** A single line in the average order value breakdown. */
export interface OrderValueBreakdown {
    /** What the number counts, e.g. "total order received by Vitalb". */
    label: string;
    value: number;
}

/** Average order value panel on the Overview dashboard. */
export interface AverageOrderValueSummary {
    /** Current average order value, e.g. 117. */
    value: number;
    /** Change against the previous period, as a percentage. */
    changePercent: number;
    /** Human-readable period, e.g. "For this month". */
    period: string;
    /** How full the progress bar is, as a percentage (0–100). */
    progressPercent: number;
    breakdown: OrderValueBreakdown[];
}

/** A single agent row in the system status panel. */
export interface SystemStatusAgent {
    /** Agent name, e.g. "AI replies". */
    name: string;
    /** Icon key, e.g. "chat". */
    icon: string;
    /** Status label, e.g. "Active". */
    status: string;
}

/** System status panel on the Overview dashboard. */
export interface SystemStatusSummary {
    agents: SystemStatusAgent[];
}

/** A single actionable tip on the Overview dashboard. */
export interface OverviewTip {
    /** Tip text, e.g. "Setup Escalate Conversations". */
    title: string;
    /** Path the tip links to. */
    href: string;
}

/** A single step in the setup progress checklist. */
export interface SetupStep {
    /** Step text, e.g. "Customise the chat to fit your brand". */
    title: string;
    completed: boolean;
}

/** Setup progress panel on the Overview dashboard. */
export interface SetupProgressSummary {
    /** Steps already done, e.g. 2. */
    completedSteps: number;
    /** Steps in total, e.g. 4. */
    totalSteps: number;
    /** Completion as a percentage (0–100). */
    percent: number;
    steps: SetupStep[];
}

/** A single "know more" item on the Overview dashboard. */
export interface KnowMoreItem {
    /** Item title, e.g. "The best thing you can do for your store". */
    title: string;
    /** Content type, e.g. "video". */
    type: string;
}

/** A single action row in the performance matrix. */
export interface PerformanceMetric {
    /** Action name, e.g. "Create discount". */
    name: string;
    /** Share of conversations that used this action, as a percentage. */
    rate: number;
    /** Current state, e.g. "Enabled". */
    status: string;
}

/** Performance matrix panel on the Overview dashboard. */
export interface PerformanceMetricsSummary {
    /** Tab labels, e.g. ["Revenue actions", …]. */
    tabs: string[];
    /** Tab to open first, matching one of `tabs`. */
    activeTab: string;
    revenueActions: PerformanceMetric[];
    supportActions: PerformanceMetric[];
    escalationActions: PerformanceMetric[];
}

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
    chatToSaleConversion: TrendPanel;
    actionTrends: TrendPanel;
    averageOrderValue: AverageOrderValueSummary;
    systemStatus: SystemStatusSummary;
    tips: OverviewTip[];
    setupProgress: SetupProgressSummary;
    knowMore: KnowMoreItem[];
    performanceMetrics: PerformanceMetricsSummary;
}
