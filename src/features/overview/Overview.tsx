import OverviewCard from "@/components/shared/OverviewCard";
import { FaceSlightlySmiling, MailWarning, MessageSquareReply } from "lucide-react";
import ChatToSaleChart from "./components/ChatToSaleChart";
import PerformanceMatrix from "./components/PerformanceMatrix";
import ActionTrend from "./components/ActionTrend";
import AverageOrderValue from "./components/AverageOrderValue";
import SystemStatus from "./components/SystemStatus";
import Tips from "./components/Tips";
import SetupProgress from "./components/SetupProgress";
import KnowMore from "./components/KnowMore";
import { useOverviewQuery } from "./overviewQuery";
import type { OverviewResponse } from "./overviewType";
import { formatNumber } from "@/lib/utils";
import type { NumberFormat } from "@/lib/utils";

function headlineMetrics(data: OverviewResponse | undefined, isLoading: boolean) {
    const stats = data?.stats;

    // Each card only needs the metric's number, not the whole stat object.
    const metric = (value: number | undefined, format: NumberFormat = "compact") =>
        isLoading ? "…" : formatNumber(value, format);

    return [
        {
            title: "Total replies",
            numbers: metric(stats?.totalReplies.value),
            icon: <MessageSquareReply size={14} />,
        },
        {
            title: "Dispute chat",
            numbers: metric(stats?.disputeChat.value),
            icon: <MailWarning size={14} />,
        },
        {
            title: "Resolution rate",
            numbers: metric(stats?.resolutionRate.value, "percent"),
            icon: <FaceSlightlySmiling size={14} />,
        },
    ];
}

export function Overview() {
    const { data, isLoading, isError } = useOverviewQuery();

    return (
        <div className="grid w-full grid-cols-1 gap-3.5 md:gap-4 lg:grid-cols-[minmax(0,1fr)_308px] 2xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
            <div className="flex flex-col gap-4">
                {isError && (
                    <p role="alert" className="text-sm text-danger">
                        Couldn’t load overview metrics.
                    </p>
                )}
                <div
                    role="region"
                    aria-label="Overview metrics"
                    tabIndex={0}
                    className="flex min-w-0 gap-2 overflow-x-auto focus-visible:outline-2 focus-visible:outline-primary md:gap-4"
                >
                    {headlineMetrics(data, isLoading).map((metric) => (
                        <div key={metric.title} className="min-w-[130px] flex-[1_0_max-content] whitespace-nowrap">
                            <OverviewCard {...metric} />
                        </div>
                    ))}
                </div>
                <ChatToSaleChart panel={data?.chatToSaleConversion} isLoading={isLoading} />
                <div className="grid min-w-0 grid-cols-1 items-start gap-4 sm:grid-cols-2">
                    <div className="sm:col-start-2 sm:row-start-1">
                        <ActionTrend panel={data?.actionTrends} isLoading={isLoading} />
                    </div>
                    <div className="sm:col-start-1 sm:row-span-2 sm:row-start-1">
                        <PerformanceMatrix panel={data?.performanceMetrics} isLoading={isLoading} />
                    </div>
                    <div className="sm:col-start-2 sm:row-start-2">
                        <AverageOrderValue panel={data?.averageOrderValue} isLoading={isLoading} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <SystemStatus panel={data?.systemStatus} isLoading={isLoading} />
                <Tips tips={data?.tips} isLoading={isLoading} />
                <SetupProgress panel={data?.setupProgress} isLoading={isLoading} />
                <KnowMore items={data?.knowMore} isLoading={isLoading} />
            </div>
        </div>
    )
}
