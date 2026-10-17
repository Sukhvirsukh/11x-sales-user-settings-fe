import { ArrowLeft, ArrowUp, Camera, CheckCheck, ChevronLeft, Lock, Mic, MoreVertical, Phone, Plus, Smile, Video } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ChatBox } from "@/components/shared/chatBox";
import { useChatVisibilityQuery } from "@/features/visibility/visibilityQuery";
import { cn } from "@/lib/utils";
import { sendPreviewMessage, type ChannelConnection, type MetaChannel } from "./channelsApi";

export type PreviewChannel = "website" | MetaChannel;

interface PreviewMessage {
    id: string;
    from: "store" | "customer";
    text: string;
    time: string;
    pending?: boolean;
    failed?: boolean;
}

const clock = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/** Links become tappable; on WhatsApp *bold* and _italic_ render as they do in the app. */
function RichText({ text, channel }: { text: string; channel: MetaChannel }) {
    const parts = text.split(/(https?:\/\/[^\s]+)/g);
    return (
        <>
            {parts.map((part, i) =>
                /^https?:\/\//.test(part) ? (
                    <a key={i} href={part} target="_blank" rel="noreferrer" className={cn("break-all underline", channel === "whatsapp" ? "text-[#027EB5]" : "")}>
                        {part}
                    </a>
                ) : channel === "whatsapp" ? (
                    <Fragment key={i}>
                        {part.split(/(\*[^*\n]+\*|_[^_\n]+_)/g).map((chunk, j) =>
                            /^\*[^*]+\*$/.test(chunk) ? <strong key={j}>{chunk.slice(1, -1)}</strong>
                                : /^_[^_]+_$/.test(chunk) ? <em key={j}>{chunk.slice(1, -1)}</em>
                                    : <Fragment key={j}>{chunk}</Fragment>,
                        )}
                    </Fragment>
                ) : (
                    <Fragment key={i}>{part}</Fragment>
                ),
            )}
        </>
    );
}

function Avatar({ src, name, size, className }: { src?: string | null; name: string; size: number; className?: string }) {
    const [broken, setBroken] = useState(false);
    const style = { width: size, height: size };
    if (src && !broken) {
        return <img src={src} alt="" style={style} onError={() => setBroken(true)} className={cn("shrink-0 rounded-full object-cover", className)} />;
    }
    return (
        <span style={{ ...style, fontSize: Math.round(size * 0.42) }} className={cn("flex shrink-0 items-center justify-center rounded-full bg-[#DFE5E7] font-semibold text-[#54656F]", className)}>
            {(name.trim()[0] ?? "S").toUpperCase()}
        </span>
    );
}

function Typing({ dotClass }: { dotClass: string }) {
    return (
        <span className="flex items-center gap-1 py-1" aria-label="Typing">
            {[0, 150, 300].map((delay) => (
                <span key={delay} className={cn("size-1.5 animate-bounce rounded-full", dotClass)} style={{ animationDelay: `${delay}ms` }} />
            ))}
        </span>
    );
}

/** A phone showing the chat the way the shopper sees it in each app, answered by the real agent. */
function PhoneChat({ channel, connection }: { channel: MetaChannel; connection?: ChannelConnection }) {
    const { data: design } = useChatVisibilityQuery();
    const chatFace = typeof design?.chatFace === "string" ? design.chatFace : null;
    const name = connection?.display_name || design?.aiAgentName || "Your store";
    const handle = channel === "instagram" ? connection?.handle || "yourstore" : null;
    const avatar = connection?.picture_url || chatFace;
    const welcome = design?.welcomeMessage?.trim() || "Hi! How can I help you today?";
    const suggestions = (design?.predefinedMessages ?? []).filter((m) => m.trim()).slice(0, 3);

    // Each channel (the parent keys this by channel) has its own test chat after the welcome message.
    const [exchange, setMessages] = useState<PreviewMessage[]>([]);
    const [openedAt] = useState(clock);
    const messages: PreviewMessage[] = [{ id: "welcome", from: "store", text: welcome, time: openedAt }, ...exchange];
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [draft, setDraft] = useState("");
    const [busy, setBusy] = useState(false);
    const scroller = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
    }, [exchange]);

    async function send(text: string) {
        const clean = text.trim();
        if (!clean || busy) return;
        setDraft("");
        setBusy(true);
        const pendingId = `p-${Date.now()}`;
        setMessages((list) => [
            ...list,
            { id: `c-${Date.now()}`, from: "customer", text: clean, time: clock() },
            { id: pendingId, from: "store", text: "", time: "", pending: true },
        ]);
        try {
            const res = await sendPreviewMessage(clean, conversationId, channel);
            setConversationId(res.conversationId);
            const reply = res.reply?.formatted ?? res.reply?.content;
            setMessages((list) => list.map((m) => (m.id === pendingId
                ? reply ? { ...m, text: reply, time: clock(), pending: false } : { ...m, text: "The agent chose not to reply to this one.", time: clock(), pending: false, failed: true }
                : m)));
        } catch (error) {
            setMessages((list) => list.map((m) => (m.id === pendingId
                ? { ...m, text: error instanceof Error ? `Couldn't get a reply: ${error.message}` : "Couldn't get a reply. Try again.", time: clock(), pending: false, failed: true }
                : m)));
        } finally {
            setBusy(false);
        }
    }

    function onSubmit(event: FormEvent) {
        event.preventDefault();
        void send(draft);
    }

    const theme = THEMES[channel];
    return (
        <div className="mx-auto flex h-[600px] w-full max-w-[320px] flex-col overflow-hidden rounded-[42px] border-[9px] border-[#1F2023] bg-[#1F2023] shadow-[0_18px_40px_-18px_rgba(15,23,42,0.45)]">
            <div className={cn("flex h-full flex-col overflow-hidden rounded-[33px]", theme.screen)}>
                {/* Status bar */}
                <div className={cn("flex items-center justify-between px-6 pb-1 pt-2.5 text-[11px] font-semibold", theme.statusBar)}>
                    <span>9:41</span>
                    <span className="h-[18px] w-[74px] rounded-full bg-[#1F2023]" aria-hidden="true" />
                    <span className="flex items-center gap-1" aria-hidden="true">
                        <span className="h-2 w-3.5 rounded-[2px] border border-current" />
                    </span>
                </div>

                {/* App header */}
                {channel === "whatsapp" && (
                    <div className="flex items-center gap-2 bg-[#008069] px-2 py-2 text-white">
                        <ArrowLeft className="size-[18px]" aria-hidden="true" />
                        <Avatar src={avatar} name={name} size={34} />
                        <div className="min-w-0 flex-1 leading-tight">
                            <p className="truncate text-[14px] font-medium">{name}</p>
                            <p className="truncate text-[11px] text-white/80">Business account</p>
                        </div>
                        <Video className="size-[18px]" aria-hidden="true" />
                        <Phone className="ml-2 size-4" aria-hidden="true" />
                        <MoreVertical className="ml-1 size-[18px]" aria-hidden="true" />
                    </div>
                )}
                {channel === "instagram" && (
                    <div className="flex items-center gap-2.5 border-b border-[#EFEFEF] bg-white px-3 py-2 text-[#0C1014]">
                        <ChevronLeft className="size-6" aria-hidden="true" />
                        <Avatar src={avatar} name={name} size={30} />
                        <div className="min-w-0 flex-1 leading-tight">
                            <p className="truncate text-[13px] font-semibold">{name}</p>
                            <p className="truncate text-[11px] text-[#737373]">{handle}</p>
                        </div>
                        <Phone className="size-[18px]" aria-hidden="true" />
                        <Video className="ml-2 size-5" aria-hidden="true" />
                    </div>
                )}
                {channel === "messenger" && (
                    <div className="flex items-center gap-2 border-b border-[#E4E6EB] bg-white px-3 py-2 text-[#050505] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                        <ArrowLeft className="size-5 text-[#0A7CFF]" aria-hidden="true" />
                        <span className="relative">
                            <Avatar src={avatar} name={name} size={32} />
                            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-[#31A24C]" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1 leading-tight">
                            <p className="truncate text-[13px] font-semibold">{name}</p>
                            <p className="truncate text-[11px] text-[#65676B]">Typically replies instantly</p>
                        </div>
                        <Phone className="size-[18px] text-[#0A7CFF]" aria-hidden="true" />
                        <Video className="ml-2 size-5 text-[#0A7CFF]" aria-hidden="true" />
                    </div>
                )}

                {/* Thread */}
                <div ref={scroller} className={cn("flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-2.5 py-3", theme.thread)}>
                    {channel === "whatsapp" && (
                        <p className="mx-auto mb-1 flex max-w-[92%] items-start gap-1 rounded-md bg-[#FFEECD] px-2 py-1 text-center text-[10.5px] leading-snug text-[#54656F]">
                            <Lock className="mt-0.5 size-2.5 shrink-0" aria-hidden="true" />
                            This business uses a secure service from Meta to manage this chat.
                        </p>
                    )}
                    {channel !== "whatsapp" && (
                        <div className="mb-3 flex flex-col items-center gap-1 pt-2 text-center">
                            <Avatar src={avatar} name={name} size={64} />
                            <p className="mt-1 text-[14px] font-semibold text-[#050505]">{name}</p>
                            <p className="text-[11px] text-[#65676B]">
                                {channel === "instagram" ? `${handle} · Instagram` : "Facebook page"}
                            </p>
                            <span className="mt-1 rounded-lg bg-[#EFEFEF] px-3 py-1 text-[11px] font-semibold text-[#050505]">
                                {channel === "instagram" ? "View profile" : "View page"}
                            </span>
                        </div>
                    )}

                    {messages.map((m) => {
                        const mine = m.from === "customer";
                        return (
                            <div key={m.id} className={cn("flex items-end gap-1.5", mine ? "justify-end" : "justify-start")}>
                                {!mine && channel !== "whatsapp" && <Avatar src={avatar} name={name} size={22} />}
                                <div className={cn("max-w-[78%] whitespace-pre-wrap break-words text-[12.5px] leading-[1.4]", mine ? theme.customer : theme.store, m.failed && "italic opacity-80")}>
                                    {m.pending ? <Typing dotClass={theme.typingDot} /> : <RichText text={m.text} channel={channel} />}
                                    {channel === "whatsapp" && !m.pending && (
                                        <span className="float-right ml-2 mt-1.5 flex translate-y-0.5 items-center gap-0.5 text-[9.5px] text-[#667781]">
                                            {m.time}
                                            {mine && <CheckCheck className="size-3 text-[#53BDEB]" aria-hidden="true" />}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {messages.length === 1 && suggestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap justify-end gap-1.5">
                            {suggestions.map((s) => (
                                <button key={s} type="button" onClick={() => void send(s)} className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors", theme.chip)}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Composer */}
                <form onSubmit={onSubmit} className={cn("flex items-center gap-1.5 px-2 pb-4 pt-1.5", theme.composerBar)}>
                    {channel === "messenger" && <Plus className="size-5 shrink-0 text-[#0A7CFF]" aria-hidden="true" />}
                    {channel === "instagram" && (
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#3797F0] text-white" aria-hidden="true">
                            <Camera className="size-3.5" />
                        </span>
                    )}
                    <label className={cn("flex min-w-0 flex-1 items-center gap-1.5 px-3 py-1.5", theme.composer)}>
                        {channel === "whatsapp" && <Smile className="size-4 shrink-0 text-[#8696A0]" aria-hidden="true" />}
                        <span className="sr-only">Message</span>
                        <input
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            placeholder={channel === "messenger" ? "Aa" : channel === "instagram" ? "Message..." : "Message"}
                            className="min-w-0 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-[#8696A0]"
                            maxLength={1000}
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={busy || !draft.trim()}
                        aria-label="Send test message"
                        className={cn("flex size-8 shrink-0 items-center justify-center rounded-full transition-opacity disabled:opacity-60", theme.send)}
                    >
                        {channel === "whatsapp" && !draft.trim() ? <Mic className="size-4" /> : <ArrowUp className="size-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
}

const THEMES: Record<MetaChannel, { screen: string; statusBar: string; thread: string; store: string; customer: string; chip: string; composerBar: string; composer: string; send: string; typingDot: string }> = {
    whatsapp: {
        screen: "bg-[#EFEAE2]",
        statusBar: "bg-[#008069] text-white",
        thread: "bg-[#EFEAE2] bg-[radial-gradient(rgba(0,0,0,0.045)_1px,transparent_1px)] bg-[length:14px_14px]",
        store: "rounded-lg rounded-tl-none bg-white px-2 py-1.5 text-[#111B21] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]",
        customer: "rounded-lg rounded-tr-none bg-[#D9FDD3] px-2 py-1.5 text-[#111B21] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]",
        chip: "bg-white text-[#008069] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] hover:bg-[#F5F6F6]",
        composerBar: "bg-transparent",
        composer: "rounded-full bg-white shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]",
        send: "bg-[#00A884] text-white",
        typingDot: "bg-[#8696A0]",
    },
    instagram: {
        screen: "bg-white",
        statusBar: "bg-white text-[#0C1014]",
        thread: "bg-white",
        store: "rounded-[20px] bg-[#EFEFEF] px-3 py-2 text-[#0C1014]",
        customer: "rounded-[20px] bg-[linear-gradient(135deg,#8B3DFF,#3D7BFF)] px-3 py-2 text-white",
        chip: "border border-[#DBDBDB] bg-white text-[#0C1014] hover:bg-[#FAFAFA]",
        composerBar: "bg-white",
        composer: "rounded-full border border-[#DBDBDB]",
        send: "bg-[#3797F0] text-white",
        typingDot: "bg-[#737373]",
    },
    messenger: {
        screen: "bg-white",
        statusBar: "bg-white text-[#050505]",
        thread: "bg-white",
        store: "rounded-[18px] bg-[#F0F0F0] px-3 py-2 text-[#050505]",
        customer: "rounded-[18px] bg-[linear-gradient(180deg,#00B2FF,#006AFF)] px-3 py-2 text-white",
        chip: "border border-[#0A7CFF]/40 bg-white text-[#0A7CFF] hover:bg-[#F0F7FF]",
        composerBar: "bg-white",
        composer: "rounded-full bg-[#F0F2F5]",
        send: "bg-[#0A7CFF] text-white",
        typingDot: "bg-[#65676B]",
    },
};

const TABS: { id: PreviewChannel; label: string }[] = [
    { id: "website", label: "Website" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "instagram", label: "Instagram" },
    { id: "messenger", label: "Messenger" },
];

interface ChannelPreviewProps {
    channel: PreviewChannel;
    onChannelChange: (channel: PreviewChannel) => void;
    connections: ChannelConnection[];
    children?: ReactNode;
}

/** The preview beside the channel list: switch apps and chat with the real agent in each. */
export default function ChannelPreview({ channel, onChannelChange, connections }: ChannelPreviewProps) {
    const connection = useMemo(() => connections.find((c) => c.channel === channel), [connections, channel]);
    return (
        <div className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">Preview</p>
                <p className="text-xs text-muted-foreground">Test chats use your real agent</p>
            </div>
            <div role="tablist" aria-label="Preview channel" className="grid grid-cols-4 gap-1 rounded-lg bg-muted p-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={channel === tab.id}
                        onClick={() => onChannelChange(tab.id)}
                        className={cn(
                            "truncate rounded-md px-1.5 py-1.5 text-xs font-medium transition-colors",
                            channel === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            {channel === "website" ? (
                <div className="mx-auto h-[600px] w-full max-w-[360px]">
                    <ChatBox className="h-full" />
                </div>
            ) : (
                <PhoneChat key={channel} channel={channel} connection={connection} />
            )}
            <p className="text-center text-xs text-muted-foreground">
                {channel === "website"
                    ? "The chat bubble on your website."
                    : connection
                        ? `How shoppers see ${connection.display_name ?? "your store"} on ${TABS.find((t) => t.id === channel)?.label}.`
                        : `How chats will look once ${TABS.find((t) => t.id === channel)?.label} is connected.`}
            </p>
        </div>
    );
}
