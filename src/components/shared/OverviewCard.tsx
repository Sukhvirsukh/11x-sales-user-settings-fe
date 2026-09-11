import AppCard from "../design/AppCard";
import Heading from "../design/Heading";

interface OverviewCardProps {
    title: string;
    numbers: string;
    icon: React.ReactNode;
}

export default function OverviewCard({ title, numbers, icon }: OverviewCardProps) {
    return (
        <AppCard
            shadow={true}
        >
            <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-section-bg rounded-[10px] flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <p className="mb-3">
                        {title}
                    </p>
                    <Heading size="xlg">
                        {numbers}
                    </Heading>
                </div>
            </div>
        </AppCard>
    )
}
