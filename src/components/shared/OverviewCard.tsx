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
            <div className="flex items-start gap-2.5 md:gap-4">
                <div className="flex size-6.25 md:size-8.75  shrink-0 self-center items-center justify-center rounded-sm bg-surface-raised">
                    {icon}
                </div>
                <div>
                    <p className="mb-3 text-sm md:text-base">
                        {title}
                    </p>
                    <Heading
                        size="lg"
                        responsive
                    >
                        {numbers}
                    </Heading>
                </div>
            </div>
        </AppSection>
    )
}
