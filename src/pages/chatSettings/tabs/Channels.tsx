import { Link } from "react-router";
import CopyField from "@/components/shared/CopyField";
import { QrCode } from "lucide-react";

export default function Channels() {
    const chatLink = "<iframe=src'hhpss....=";
    const embedCode = "<iframe=src'hhpss....=";

    return (
        <div className="min-w-0 space-y-4 sm:space-y-5">
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground">
                        <span className="text-caption font-semibold text-primary-foreground">V</span>
                        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-primary-foreground bg-success-strong" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-body font-medium text-foreground">Vita chat</p>
                        <p className="text-caption text-muted-foreground">
                            Talk to Vita lab directly on site
                        </p>
                    </div>
                </div>
                <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
                    <Link
                        to="/chat-settings/visibility"
                        className="inline-flex min-h-9 flex-1 items-center justify-center rounded-lg bg-foreground px-3.5 py-1.5 text-caption font-medium text-primary-foreground transition-colors hover:bg-foreground/80 sm:flex-none"
                    >
                        Visibility
                    </Link>
                    <button className="min-h-9 flex-1 rounded-lg border border-border px-3.5 py-1.5 text-caption font-medium text-foreground/80 transition-colors hover:bg-muted sm:flex-none">
                        Edit
                    </button>
                </div>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-6 rounded-lg bg-card px-3 py-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8 sm:px-4">
                <div className="flex min-w-0 flex-col gap-5">
                    <div className="min-w-0">
                        <p className="text-body font-semibold text-foreground">
                            Link to chat
                        </p>
                        <p className="mt-0.5 text-caption text-muted-foreground">
                            Use the following link to the standalone chat page
                        </p>
                        <div className="relative mt-2 min-w-0">
                            <CopyField value={chatLink} />
                        </div>
                    </div>

                    <div className="min-w-0">
                        <p className="text-body font-semibold text-foreground">
                            Embedded chat (iframe)
                        </p>
                        <p className="mt-0.5 text-caption text-muted-foreground">
                            Add the following code into the HTML code of your page
                        </p>
                        <div className="relative mt-2 min-w-0">
                            <CopyField value={embedCode} />
                        </div>
                    </div>
                </div>

                <div className="hidden w-px bg-border lg:block" />

                <div className="min-w-0 border-t border-border pt-5 lg:border-t-0 lg:pt-0">
                    <p className="text-body font-semibold text-foreground">QR code</p>
                    <p className="mt-0.5 text-caption text-muted-foreground">
                        Scanning this QR code will lead customers to a standalone
                        chat page
                    </p>
                    <div className="mt-3 flex h-24 w-24 items-center justify-center rounded-lg border border-border bg-card">
                        <QrCode className="h-16 w-16 text-foreground" strokeWidth={1.2} />
                    </div>
                    <button className="mt-3 min-h-9 rounded-lg border border-border px-3.5 py-1.5 text-caption font-medium text-foreground/80 transition-colors hover:bg-muted">
                        Download QR
                    </button>
                </div>
            </div>
        </div>
    );
}
