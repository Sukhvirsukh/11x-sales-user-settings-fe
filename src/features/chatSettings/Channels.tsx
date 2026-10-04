import { useQuery } from "@tanstack/react-query";
import { Download, ExternalLink, Globe, SquarePen } from "lucide-react";
import QRCode from "qrcode";
import { useNavigate } from "react-router";
import AppCard from "@/components/design/AppCard";
import CopyField from "@/components/shared/CopyField";
import { Button } from "@/components/ui/button";
import { useAgentStore } from "@/features/agents/agentStore";
import { agentPublicUrl } from "@/lib/agentApi";

/** The chat's own page, the widget snippet for any website, and a QR code for the page. */
export default function Channels() {
    const navigate = useNavigate();
    const agentId = useAgentStore((state) => state.currentAgentId);
    const storeName = useAgentStore((state) => state.agents.find((agent) => agent.id === state.currentAgentId)?.name);

    const chatLink = agentId && agentPublicUrl ? `${agentPublicUrl}/c/${agentId}` : "";
    const embedCode = agentId && agentPublicUrl
        ? `<script src="${agentPublicUrl}/widget.js" data-agent="${agentId}" async></script>`
        : "";

    const { data: qr = null } = useQuery({
        queryKey: ["chatSettings", "qr", chatLink],
        queryFn: () => QRCode.toDataURL(chatLink, { width: 512, margin: 1, color: { dark: "#16181D", light: "#FFFFFF" } }),
        enabled: Boolean(chatLink),
        staleTime: Infinity,
    });

    function downloadQr() {
        if (!qr) return;
        const link = document.createElement("a");
        link.href = qr;
        link.download = `${(storeName ?? "store").replace(/[^\w-]+/g, "-").toLowerCase()}-chat-qr.png`;
        link.click();
    }

    return (
        <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                        <Globe className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-base font-medium text-foreground">Website chat</p>
                        <p className="text-sm text-muted-foreground">Shoppers talk to your AI agent right on your site.</p>
                    </div>
                </div>
                <Button variant="outline" onClick={() => navigate("/chat-settings/visibility")}>
                    <SquarePen className="size-4" />
                    Design &amp; visibility
                </Button>
            </div>

            <AppCard>
                <div className="flex min-w-0 flex-col gap-6 lg:flex-row">
                    <div className="flex min-w-0 flex-1 flex-col gap-5">
                        <div className="min-w-0">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-base font-medium text-foreground">Chat page link</p>
                                {chatLink && (
                                    <a
                                        href={chatLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                                    >
                                        Open <ExternalLink className="size-3.5" aria-hidden="true" />
                                    </a>
                                )}
                            </div>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                A full-page chat you can share anywhere — emails, social bios, receipts.
                            </p>
                            <div className="mt-2 min-w-0">
                                <CopyField value={chatLink || "Available once your store is selected"} />
                            </div>
                        </div>

                        <div className="min-w-0">
                            <p className="text-base font-medium text-foreground">Add to any website</p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Paste this before <code className="rounded bg-muted px-1 py-0.5 text-[12px]">&lt;/body&gt;</code> on every page.
                                On Shopify, use the app embed under Integrations instead.
                            </p>
                            <div className="mt-2 min-w-0">
                                <CopyField value={embedCode || "Available once your store is selected"} />
                            </div>
                        </div>
                    </div>

                    <div className="hidden w-px shrink-0 bg-divider lg:block" />

                    <div className="flex min-w-0 items-start gap-4 border-t border-divider pt-5 lg:w-[260px] lg:shrink-0 lg:flex-col lg:border-t-0 lg:pt-0">
                        <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-1.5">
                            {qr ? (
                                <img src={qr} alt="QR code for the chat page" className="size-full" />
                            ) : (
                                <span className="text-center text-xs text-muted-foreground">QR code</span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-base font-medium text-foreground">QR code</p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Print it on packaging or in-store signs; it opens the chat page.
                            </p>
                            <Button variant="outline" size="sm" className="mt-3" onClick={downloadQr} disabled={!qr}>
                                <Download className="size-3.5" />
                                Download PNG
                            </Button>
                        </div>
                    </div>
                </div>
            </AppCard>
        </div>
    );
}
