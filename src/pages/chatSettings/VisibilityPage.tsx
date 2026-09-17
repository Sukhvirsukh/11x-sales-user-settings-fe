// import { PageHeader } from "@/components/shared/PageHeader";
import previewBackground from "@/assets/chatSettings/preview-background.png";
import { Visibility } from "@/features/visibility";

export default function VisibilityPage() {
    return (
        <section className="relative isolate h-full min-w-0 overflow-hidden">
            <img
                src={previewBackground}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-top mix-blend-multiply opacity-20"
            />
            {/* <PageHeader title="Chat visibility" backTo="/chat-settings"> */}
            <Visibility />
            {/* </PageHeader> */}
        </section>
    );
}
