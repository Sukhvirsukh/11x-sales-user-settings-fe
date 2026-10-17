import { PageHeader } from "@/components/shared/PageHeader";
import { AskAI } from "@/features/askAi";

export default function AskMePage() {
    return (
        <section className="h-full min-w-0">
            <PageHeader
                title="Ask me"
                subtitle="Ask anything about 11xsales.ai or your store's numbers, in plain words."
            >
                <AskAI />
            </PageHeader>
        </section>
    )
}
