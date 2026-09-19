import AppSection from "../design/AppSectoin";
import Heading from "../design/Heading";

interface OverviewCardProps {
    title: string;
    numbers: string;
    icon: React.ReactNode;
}

export default function OverviewCard({ title, numbers, icon }: OverviewCardProps) {
    return (
        <AppSection>
            <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface-raised">
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
        </AppSection>
    )
}
