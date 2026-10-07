import AppSection from "../design/AppSectoin";

interface OverviewCardProps {
    title: string;
    numbers: string;
    icon: React.ReactNode;
}

/** A headline number with its label, as on the Overview's top row. */
export default function OverviewCard({ title, numbers, icon }: OverviewCardProps) {
    return (
        <AppSection className="gap-3">
            <div className="flex w-full items-center justify-between gap-3">
                <p className="text-base text-muted-foreground">{title}</p>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4">
                    {icon}
                </span>
            </div>
            <p className="tabular font-display text-[28px] leading-8 font-semibold tracking-[-0.02em] text-foreground">
                {numbers}
            </p>
        </AppSection>
    )
}
