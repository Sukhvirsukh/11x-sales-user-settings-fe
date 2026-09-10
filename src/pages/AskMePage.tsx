import { PageHeader } from "@/components/shared/PageHeader";
import { AskAI } from "@/features/askAi";

export default function AskMePage() {
    return (
        <section className="h-full min-w-0">
            <PageHeader
                title="Ask me"
                subtitle="Get yourself cleared everything about the app"
            >
                <AskAI />
            </PageHeader>
        </section>
    )
}
