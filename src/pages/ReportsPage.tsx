import PreviewSection from "@/components/design/PreviewSection";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reports } from "@/features/reports";

export default function ReportsPage() {
    return (
        <section className="h-full min-w-0">
            <PageHeader
                title="Reports"
                subtitle="Track your performance with detailed reports, usually after 10 conversation, reports gets generated."
            >
                <PreviewSection>
                    <Reports />
                </PreviewSection>
            </PageHeader>
        </section>
    )
}
