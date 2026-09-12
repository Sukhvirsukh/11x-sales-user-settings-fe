import { PageHeader } from "@/components/shared/PageHeader";
import { Overview } from "@/features/overview";

export default function OverviewPage() {
    return (
        <section className="h-full min-w-0">
            <PageHeader
                title="Overview"
                subtitle="Track key store metrics and measure the real-world impact of your AI agent."
            >
                <div className="pb-5">
                    <Overview />
                </div>
            </PageHeader>
        </section>
    )
}
