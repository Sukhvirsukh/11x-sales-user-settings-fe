import { useQuery } from "@tanstack/react-query";
import { Download, ExternalLink, SquarePen } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import CopyField from "@/components/shared/CopyField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useAgentStore } from "@/features/agents/agentStore";
import { useCan } from "@/features/auth";
import { agentPublicUrl } from "@/lib/agentApi";
import { cn } from "@/lib/utils";
import { WebsiteLogo } from "./channels/ChannelLogos";
import ChannelPreview, { type PreviewChannel } from "./channels/ChannelPreview";
import ConnectPicker from "./channels/ConnectPicker";
import MetaChannelCard from "./channels/MetaChannelCard";
import { CHANNEL_INFO } from "./channels/channelInfo";
import { META_CHANNELS, useChannelsQuery, type MetaChannel } from "./channels/channelsApi";

/** The chat bubble for the store's site, its standalone page and a QR code. */
function WebsiteChannelCard({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
    const navigate = useNavigate();
    const agentId = useAgentStore((state) => state.currentAgentId);
    const storeName = useAgentStore((state) => state.agents.find((agent) => agent.id === state.currentAgentId)?.name);

    const chatPage = agentId && agentPublicUrl ? `${agentPublicUrl}/c/${agentId}` : "";
    const embedCode = agentId && agentPublicUrl ? `<script src="${agentPublicUrl}/widget.js" data-agent="${agentId}" async></script>` : "";

    const { data: qr = null } = useQuery({
        queryKey: ["chatSettings", "qr", chatPage],
        queryFn: () => QRCode.toDataURL(chatPage, { width: 512, margin: 1, color: { dark: "#16181D", light: "#FFFFFF" } }),
        enabled: Boolean(chatPage),
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
        <section
            aria-label="Website chat"
            onClick={onSelect}
            className={cn(
                "min-w-0 overflow-hidden rounded-xl border bg-app-card-background transition-shadow",
                selected ? "border-brand/50 shadow-[0_0_0_3px_var(--color-brand-soft)]" : "border-section-border",
            )}
        >
            <div className="flex items-start gap-3 p-4 sm:items-center md:p-5">
                <WebsiteLogo />
                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-medium text-foreground">Website chat</h3>
                        <Badge variant="default">Active</Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">Shoppers talk to your AI agent right on your site.</p>
                </div>
                <Button variant="outline" size="sm" className="self-start sm:self-auto" onClick={(event) => { event.stopPropagation(); navigate("/chat-settings/visibility"); }}>
                    <SquarePen className="size-3.5" /> Design &amp; visibility
                </Button>
                </div>
            </div>
            <div className="border-t border-divider bg-surface-subtle/60 p-4 md:p-5" onClick={(event) => event.stopPropagation()}>
                <div className="flex min-w-0 flex-col gap-5 lg:flex-row">
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-foreground">Add to any website</p>
                            </div>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Paste before <code className="rounded bg-muted px-1 py-0.5 text-[12px]">&lt;/body&gt;</code> on every page. On Shopify, use the app embed under Integration instead.
                            </p>
                            <div className="mt-2 min-w-0"><CopyField value={embedCode || "Available once your store is selected"} /></div>
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-foreground">Chat page link</p>
                                {chatPage && (
                                    <a href={chatPage} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                                        Open <ExternalLink className="size-3.5" aria-hidden="true" />
                                    </a>
                                )}
                            </div>
                            <p className="mt-0.5 text-sm text-muted-foreground">A full-page chat to share anywhere: emails, social bios, receipts.</p>
                            <div className="mt-2 min-w-0"><CopyField value={chatPage || "Available once your store is selected"} /></div>
                        </div>
                    </div>
                    <div className="flex min-w-0 items-start gap-4 lg:w-[220px] lg:shrink-0 lg:flex-col">
                        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-1.5">
                            {qr ? <img src={qr} alt="QR code for the chat page" className="size-full" /> : <span className="text-center text-xs text-muted-foreground">QR code</span>}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">QR code</p>
                            <p className="mt-0.5 text-sm text-muted-foreground">Opens the chat page; print it on packaging or in-store signs.</p>
                            <Button variant="outline" size="sm" className="mt-2" onClick={downloadQr} disabled={!qr}>
                                <Download className="size-3.5" /> Download PNG
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/** Every place shoppers reach the agent: the website plus WhatsApp, Instagram and Messenger, with a live preview. */
export default function Channels() {
    const channels = useChannelsQuery();
    const canManage = useCan("chatSettings.create");
    const [searchParams, setSearchParams] = useSearchParams();
    const fromParam = searchParams.get("channel");
    const [preview, setPreview] = useState<PreviewChannel>(
        fromParam && (META_CHANNELS as string[]).includes(fromParam) ? (fromParam as MetaChannel) : "website",
    );
    const sessionId = searchParams.get("connect");

    // Back from Facebook with an error: say what happened, then tidy the address bar.
    useEffect(() => {
        const error = searchParams.get("channelError");
        if (!error) return;
        const ch = searchParams.get("channel");
        toast.add({ type: "error", title: ch && ch in CHANNEL_INFO ? CHANNEL_INFO[ch as MetaChannel].name : "Channels", description: error });
        const next = new URLSearchParams(searchParams);
        next.delete("channelError");
        next.delete("channel");
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

    function closePicker() {
        const next = new URLSearchParams(searchParams);
        next.delete("connect");
        next.delete("channel");
        setSearchParams(next, { replace: true });
    }

    const connections = channels.data?.connections ?? [];
    return (
        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="flex min-w-0 flex-col gap-3">
                <WebsiteChannelCard selected={preview === "website"} onSelect={() => setPreview("website")} />
                {META_CHANNELS.map((ch) => (
                    <MetaChannelCard
                        key={ch}
                        channel={ch}
                        connection={connections.find((c) => c.channel === ch)}
                        available={Boolean(channels.data?.available?.[ch])}
                        canManage={canManage}
                        selected={preview === ch}
                        onSelect={() => setPreview(ch)}
                    />
                ))}
                {channels.isError && (
                    <p className="text-sm text-destructive">Couldn't load your messaging channels. {(channels.error as Error).message}</p>
                )}
            </div>
            <aside aria-label="Channel preview" className="min-w-0 xl:sticky xl:top-4 xl:self-start">
                <ChannelPreview channel={preview} onChannelChange={setPreview} connections={connections} />
            </aside>
            {sessionId && <ConnectPicker sessionId={sessionId} onDone={closePicker} />}
        </div>
    );
}
