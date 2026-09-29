import Heading from "@/components/design/Heading";
import { ChevronRight } from "lucide-react";
import CopyField from "../CopyField";

export default function ShareUrlField({ url }: { url: string }) {
    return (
        <div className="">
            <div className="mb-2.5 flex w-full items-center justify-between gap-2 text-left">
                <Heading size="md" className="font-semibold">Share URL</Heading>
                <ChevronRight aria-hidden className="hidden size-4 shrink-0 text-content-muted lg:block" />
            </div>
            <CopyField value={url} />
        </div>
    )
}
