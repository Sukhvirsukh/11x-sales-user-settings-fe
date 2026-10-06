import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronDown, Download, ExternalLink, Pause, Play, Unplug } from "lucide-react";
import QRCode from "qrcode";
import { useState, type ReactNode } from "react";
import CopyField from "@/components/shared/CopyField";
import Modal from "@/components/design/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { CHANNEL_INFO } from "./channelInfo";
import {
    channelsQueryKey,
    chatLink,
    disconnectChannel,
    startConnect,
    updateChannel,
    type ChannelConnection,
    type MetaChannel,
} from "./channelsApi";

function StatusBadge({ connection, available }: { connection?: ChannelConnection; available: boolean }) {
    if (!connection) return available ? <Badge variant="darkSecondary">Not connected</Badge> : <Badge variant="darkOutline">Coming soon</Badge>;
    if (connection.status === "active") return <Badge variant="default">Active</Badge>;
    if (connection.status === "paused") return <Badge variant="warning">Paused</Badge>;
    return <Badge variant="destructiveDark">Action required</Badge>;
}

function connectedLine(connection: ChannelConnection) {
    switch (connection.channel) {
        case "whatsapp":
            return `Connected to ${connection.handle}${connection.display_name && connection.display_name !== connection.handle ? ` · ${connection.display_name}` : ""}`;
        case "instagram":
            return `Connected to @${connection.handle}${connection.meta.pageName ? ` · linked to ${connection.meta.pageName}` : ""}`;
        case "messenger":
            return `Connected to ${connection.display_name ?? "your page"}`;
    }
}

function Collapsible({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-t border-divider">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/40 md:px-5"
            >
                {title}
                <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden="true" />
            </button>
            {open && <div className="px-4 pb-4 md:px-5">{children}</div>}
        </div>
    );
}

function ShareTools({ connection, canManage }: { connection: ChannelConnection; canManage: boolean }) {
    const info = CHANNEL_INFO[connection.channel];
    const link = chatLink(connection);
    const [prefill, setPrefill] = useState(connection.meta.prefill ?? "");
    const supportsPrefill = connection.channel !== "instagram";
    const { data: qr = null } = useQuery({
        queryKey: ["chatSettings", "qr", link],
        queryFn: () => QRCode.toDataURL(link, { width: 512, margin: 1, color: { dark: "#16181D", light: "#FFFFFF" } }),
        staleTime: Infinity,
    });
    const savePrefill = useMutation({
        mutationFn: () => updateChannel(connection.channel, { prefill }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: channelsQueryKey });
            toast.add({ type: "success", title: info.name, description: "Pre-filled message saved." });
        },
    });

    function downloadQr() {
        if (!qr) return;
        const a = document.createElement("a");
        a.href = qr;
        a.download = `${info.name.toLowerCase()}-chat-qr.png`;
        a.click();
    }

    return (
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-foreground">Chat link</p>
                        <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                            Test <ExternalLink className="size-3.5" aria-hidden="true" />
                        </a>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">Put it on your website, emails and social bios to start a {info.name} chat.</p>
                    <div className="mt-2 min-w-0"><CopyField value={link} /></div>
                </div>
                {supportsPrefill && (
                    <form
                        className="min-w-0"
                        onSubmit={(event) => {
                            event.preventDefault();
                            if (canManage) savePrefill.mutate();
                        }}
                    >
                        <label htmlFor={`prefill-${connection.channel}`} className="text-sm font-medium text-foreground">Pre-filled message</label>
                        <p className="mt-0.5 text-sm text-muted-foreground">Typed in for the shopper when they open the link or scan the code.</p>
                        <div className="mt-2 flex min-w-0 gap-2">
                            <input
                                id={`prefill-${connection.channel}`}
                                value={prefill}
                                onChange={(event) => setPrefill(event.target.value)}
                                maxLength={300}
                                disabled={!canManage}
                                placeholder="Hi! I have a question about…"
                                className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                            <Button type="submit" variant="outline" size="sm" className="h-9" disabled={!canManage || savePrefill.isPending || prefill === (connection.meta.prefill ?? "")}>
                                Save
                            </Button>
                        </div>
                    </form>
                )}
            </div>
            <div className="flex min-w-0 items-start gap-4 lg:w-[220px] lg:shrink-0 lg:flex-col">
                <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-1.5">
                    {qr ? <img src={qr} alt={`QR code that opens a ${info.name} chat`} className="size-full" /> : <Spinner />}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">QR code</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">For packaging, receipts and in-store signs.</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={downloadQr} disabled={!qr}>
                        <Download className="size-3.5" /> Download PNG
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface MetaChannelCardProps {
    channel: MetaChannel;
    connection?: ChannelConnection;
    available: boolean;
    canManage: boolean;
    selected: boolean;
    onSelect: () => void;
}

/** One messaging app: connect it, see which number/page/account answers, pause or disconnect, share links. */
export default function MetaChannelCard({ channel, connection, available, canManage, selected, onSelect }: MetaChannelCardProps) {
    const info = CHANNEL_INFO[channel];
    const [confirmDisconnect, setConfirmDisconnect] = useState(false);

    const connect = useMutation({
        mutationFn: () => startConnect(channel),
        onSuccess: ({ url }) => window.location.assign(url),
    });
    const pause = useMutation({
        mutationFn: (paused: boolean) => updateChannel(channel, { paused }),
        onSuccess: async (row) => {
            await queryClient.invalidateQueries({ queryKey: channelsQueryKey });
            toast.add({ type: "success", title: info.name, description: row.status === "paused" ? "Paused. Messages wait for your team in the inbox." : "Your agent is answering again." });
        },
    });
    const remove = useMutation({
        mutationFn: () => disconnectChannel(channel),
        onSuccess: async () => {
            setConfirmDisconnect(false);
            await queryClient.invalidateQueries({ queryKey: channelsQueryKey });
            toast.add({ type: "success", title: info.name, description: "Disconnected." });
        },
    });

    const subtitle = connection ? connectedLine(connection) : available ? info.pitch : `${info.pitch} Connecting ${info.name} opens soon.`;

    return (
        <section
            aria-label={info.name}
            onClick={onSelect}
            className={cn(
                "min-w-0 overflow-hidden rounded-xl border bg-app-card-background transition-shadow",
                selected ? "border-brand/50 shadow-[0_0_0_3px_var(--color-brand-soft)]" : "border-section-border",
            )}
        >
            <div className="flex items-start gap-3 p-4 sm:items-center md:p-5">
                {connection?.picture_url ? (
                    <span className="relative shrink-0">
                        <img src={connection.picture_url} alt="" className="size-10 rounded-full object-cover" />
                        <span className="absolute -bottom-1 -right-1 rounded-[6px] bg-white p-px"><span className="block [&>svg]:size-4">{info.logo}</span></span>
                    </span>
                ) : info.logo}
                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-medium text-foreground">{info.name}</h3>
                        <StatusBadge connection={connection} available={available} />
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
                    {connection?.status === "action_required" && connection.error && (
                        <p className="mt-1 text-sm text-destructive">{connection.error}</p>
                    )}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2" onClick={(event) => event.stopPropagation()}>
                    {!connection && (
                        <Button
                            onClick={() => connect.mutate()}
                            disabled={!available || !canManage || connect.isPending}
                            title={!available ? `Connecting ${info.name} isn't switched on yet` : !canManage ? "Your role can't change channels" : undefined}
                        >
                            {connect.isPending ? <Spinner /> : null}
                            Connect {info.account === "page" ? "page" : info.account === "account" ? "account" : "number"}
                        </Button>
                    )}
                    {connection && connection.status !== "action_required" && (
                        <Button variant="outline" size="sm" onClick={() => pause.mutate(connection.status === "active")} disabled={!canManage || pause.isPending}>
                            {connection.status === "active" ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                            {connection.status === "active" ? "Pause" : "Resume"}
                        </Button>
                    )}
                    {connection?.status === "action_required" && (
                        <Button size="sm" onClick={() => connect.mutate()} disabled={!canManage || connect.isPending}>Reconnect</Button>
                    )}
                    {connection && (
                        <Button variant="outline" size="sm" className="text-destructive" onClick={() => setConfirmDisconnect(true)} disabled={!canManage}>
                            <Unplug className="size-3.5" /> Disconnect
                        </Button>
                    )}
                </div>
                </div>
            </div>

            {connection && connection.status !== "action_required" && (
                <div className="border-t border-divider bg-surface-subtle/60 p-4 md:p-5" onClick={(event) => event.stopPropagation()}>
                    <ShareTools connection={connection} canManage={canManage} />
                </div>
            )}

            <Collapsible title={connection ? `About ${info.name}` : `Before you connect ${info.name}`} defaultOpen={false}>
                <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-muted-foreground">
                    {info.requirements.map((r) => <li key={r}>{r}</li>)}
                    {connection && <li>Pausing keeps the connection; new messages wait in Conversations for your team.</li>}
                </ul>
            </Collapsible>

            <Modal
                open={confirmDisconnect}
                onOpenChange={setConfirmDisconnect}
                title={`Disconnect ${info.name}?`}
                primaryAction={{ label: remove.isPending ? "Disconnecting…" : "Disconnect", variant: "destructive", onClick: () => remove.mutate(), disabled: remove.isPending }}
                closeAction={{ label: "Cancel", disabled: remove.isPending }}
            >
                <p className="text-sm text-muted-foreground">
                    Your agent stops answering {connection ? connectedLine(connection).replace(/^Connected to /, "") : info.name}. Past conversations stay in your inbox, and you can connect again any time.
                </p>
            </Modal>
        </section>
    );
}
