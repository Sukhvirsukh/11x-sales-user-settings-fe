import { PageHeader } from "@/components/shared/PageHeader";
import { Visibility } from "@/features/visibility";

export default function VisibilityPage() {
    return (
        <section className="h-full min-w-0">
            <PageHeader title="Chat visibility" backTo="/chat-settings">
                <Visibility />
            </PageHeader>
        </section>
    );
}
