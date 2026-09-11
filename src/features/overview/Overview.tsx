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

export function Overview() {
    return (
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_350px]">
            <div className="flex flex-col gap-4">
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
                    <OverviewCard
                        title="Total replies"
                        numbers="40k"
                        icon={<MessageSquareReply size={20} />}
                    />
                    <OverviewCard
                        title="Dispute chat"
                        numbers="402"
                        icon={<MailWarning size={20} />}
                    />
                    <OverviewCard
                        title="Resolution rate"
                        numbers="70%"
                        icon={<FaceSlightlySmiling size={20} />}
                    />

                </div>
                <ChatToSaleChart />
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
