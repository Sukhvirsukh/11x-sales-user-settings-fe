import { memo } from "react";
import { Paintbrush, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import CopyField from "@/components/shared/CopyField";
import ActionCard from "@/components/shared/ActionCard";
import { useNavigate } from "react-router";

const copyFieldContainerClassName =
    "h-auto rounded-[10px] border-0 bg-muted py-[7px] focus-within:border-0 focus-within:bg-muted focus-within:ring-0";

const VitaChatIcon = memo(function VitaChatIcon() {
    return (
        <div className="flex items-center justify-center relative">
            <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-black/15 bg-white md:size-10">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-primary" />
            </div>
            <span className="absolute top-1 right-0.5 size-2 rounded-full bg-status-online" />
        </div>
    );
});

const VisibilityAction = memo(function VisibilityAction() {

    const navigate = useNavigate();

    return (
        <Button className="gap-2 border-0! px-4 py-2 md:py-2.5" onClick={() => navigate('/chat-settings/visibility')}>
            Visibility
            <Paintbrush className="size-4" />
        </Button>
    );
});

export default function Channels() {
    const chatLink = "<iframe=src'hhpss....=";
    const embedCode = "<iframe=src'hhpss....=";

    return (
        <div className="flex min-w-0 flex-col gap-2.5 md:gap-4">
            <ActionCard
                icon={<VitaChatIcon />}
                title="Vita chat"
                subtitle="Talk to Vita lab directly on site"
                actions={<VisibilityAction />}
            />

            <div className="rounded-[10px] bg-white p-2.5 md:p-4">
                <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:gap-5">
                    <div className="flex min-w-0 flex-1 flex-col gap-3 md:gap-5">
                        <div className="min-w-0">
                            <p className="text-base font-semibold text-foreground md:text-lg">
                                Link to chat
                            </p>
                            <p className="mt-2 text-muted-foreground">
                                Use the following link to the standalone chat page
                            </p>
                            <div className="mt-2 min-w-0">
                                <CopyField
                                    value={chatLink}
                                    containerClassName={copyFieldContainerClassName}
                                />
                            </div>
                        </div>

                        <div className="min-w-0">
                            <p className="text-base font-semibold text-foreground md:text-lg">
                                Embedded chat (iframe)
                            </p>
                            <p className="mt-2 text-muted-foreground">
                                Add the following code into the HTML code of your page
                            </p>
                            <div className="mt-2 min-w-0">
                                <CopyField
                                    value={embedCode}
                                    containerClassName={copyFieldContainerClassName}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="hidden w-px shrink-0 bg-border-light lg:block" />

                    <div className="min-w-0 border-t border-border-light pt-2.5 lg:w-[min(100%,280px)] lg:shrink-0 lg:border-t-0 lg:pt-0">
                        <p className="text-base font-medium text-foreground md:text-lg">
                            QR code
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            Scanning this QR code will lead customers to a standalone
                            chat page
                        </p>
                        <div className="mt-3 size-16 text-foreground">
                            <QrCode className="size-full" strokeWidth={1.2} />
                        </div>
                        <Button
                            variant="secondary"
                            className="mt-3 border-gray text-gray"
                        >
                            Download QR
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
