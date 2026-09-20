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
            icon: <MessageSquareReply size={20} />,
        },
        {
            title: "Dispute chat",
            numbers: metric(stats?.disputeChat.value),
            icon: <MailWarning size={20} />,
        },
        {
            title: "Resolution rate",
            numbers: metric(stats?.resolutionRate.value, "percent"),
            icon: <FaceSlightlySmiling size={20} />,
        },
    ];
}

export function Overview() {
    const { data, isLoading, isError } = useOverviewQuery();

    return (
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_308px]">
            <div className="flex flex-col gap-4">
                {isError && (
                    <p role="alert" className="text-sm text-danger">
                        Couldn’t load overview metrics.
                    </p>
                )}
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
                    {headlineMetrics(data, isLoading).map((metric) => (
                        <OverviewCard key={metric.title} {...metric} />
                    ))}
                </div>
                <ChatToSaleChart conversion={data?.chatToSaleConversion} isLoading={isLoading} />
                <div className="grid min-w-0 grid-cols-1 items-start gap-4 sm:grid-cols-2">
                    <PerformanceMatrix />
                    <div className="flex flex-col gap-4">
                        <ActionTrend />
                        <AverageOrderValue />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <SystemStatus />
                <Tips />
                <SetupProgress />
                <KnowMore />
            </div>
        </div>
    )
}
