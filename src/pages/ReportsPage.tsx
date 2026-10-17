import PreviewSection from "@/components/design/PreviewSection";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reports } from "@/features/reports";

export default function ReportsPage() {
    return (
        <section className="h-full min-w-0">
            <PageHeader
                title="Reports"
                subtitle="Download conversations, escalations and sales from chat for any date range."
            >
                <PreviewSection>
                    <Reports />
                </PreviewSection>
            </PageHeader>
        </section>
    )
}
