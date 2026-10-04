import PreviewSection from "@/components/design/PreviewSection";
import { PageHeader } from "@/components/shared/PageHeader";
import { Overview } from "@/features/overview";

export default function OverviewPage() {
    return (
        <section className="h-full min-w-0">
            <PageHeader
                title="Overview"
                subtitle="How your AI agent is selling, and what's left to set up."
            >
                <PreviewSection>
                    <Overview />
                </PreviewSection>
            </PageHeader>
        </section>
    )
}
