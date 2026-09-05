import type { ReactNode } from "react";
import Heading from "@/components/design/Heading";

export default function SectionHeader({
    heading,
    children,
}: {
    heading: string;
    children: ReactNode;
}) {
    return (
        <section className="flex w-full min-w-0 flex-col gap-3.5">
            <Heading size="lg" as="h4">
                {heading}
            </Heading>
            <div className="min-w-0">{children}</div>
        </section>
    );
}
