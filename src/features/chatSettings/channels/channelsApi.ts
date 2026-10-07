import { useQuery } from "@tanstack/react-query";
import { agentApiConfigured, agentFetch } from "@/lib/agentApi";
import { useAgentStore } from "@/features/agents/agentStore";

export type MetaChannel = "whatsapp" | "instagram" | "messenger";
export const META_CHANNELS: MetaChannel[] = ["whatsapp", "instagram", "messenger"];

export interface ChannelConnection {
    id: number;
    channel: MetaChannel;
    /** WhatsApp phone number id, Facebook page id or Instagram account id. */
    external_id: string;
    display_name: string | null;
    /** The number (WhatsApp), username (Instagram) or page id (Messenger). */
    handle: string | null;
    picture_url: string | null;
    status: "active" | "paused" | "action_required";
    error: string | null;
    meta: { prefill?: string; pageId?: string; pageName?: string; number?: string; wabaId?: string };
    created_at: string;
    updated_at: string;
}

export interface ChannelsResponse {
    connections: ChannelConnection[];
    /** Whether 11xsales.ai's Meta app is set up for each channel. */
    available: Record<MetaChannel, boolean>;
}

export interface ConnectOption {
    id: string;
    name: string;
    detail: string;
    picture?: string | null;
}

export const channelsQueryKey = ["chatSettings", "channels"] as const;

export function useChannelsQuery() {
    const agentId = useAgentStore((state) => state.currentAgentId);
    return useQuery({
        queryKey: [...channelsQueryKey, agentId],
        queryFn: () => agentFetch<ChannelsResponse>("/channels", { notifyOnError: false }),
        enabled: agentApiConfigured && Boolean(agentId),
    });
}

/** Returns the link that starts Meta's sign-in for this store. */
export function startConnect(channel: MetaChannel) {
    return agentFetch<{ url: string }>(`/channels/${channel}/connect`, { method: "POST" });
}

export function getConnectSession(sessionId: string) {
    return agentFetch<{ channel: MetaChannel; error: string | null; options: ConnectOption[] }>(
        `/channels/sessions/${encodeURIComponent(sessionId)}`,
        { notifyOnError: false },
    );
}

export function finishConnect(sessionId: string, optionId: string) {
    return agentFetch<ChannelConnection>(`/channels/sessions/${encodeURIComponent(sessionId)}`, {
        method: "POST",
        body: { optionId },
        notifyOnError: false,
    });
}

export function updateChannel(channel: MetaChannel, patch: { paused?: boolean; prefill?: string }) {
    return agentFetch<ChannelConnection>(`/channels/${channel}`, { method: "PUT", body: patch });
}

export function disconnectChannel(channel: MetaChannel) {
    return agentFetch<{ ok: true }>(`/channels/${channel}`, { method: "DELETE" });
}

/** A real agent reply for the channel preview, formatted the way that app shows it. */
export function sendPreviewMessage(text: string, conversationId: string | null, channel: MetaChannel | null) {
    return agentFetch<{ conversationId: string; reply: { id: number; content: string; formatted?: string } | null }>("/test-chat", {
        method: "POST",
        body: { text, conversationId, ...(channel ? { channel } : {}) },
        notifyOnError: false,
    });
}

/** The link that opens a chat with the store in each app. */
export function chatLink(connection: ChannelConnection): string {
    const prefill = connection.meta.prefill?.trim();
    switch (connection.channel) {
        case "whatsapp": {
            const digits = (connection.handle ?? connection.meta.number ?? "").replace(/\D/g, "");
            return `https://wa.me/${digits}${prefill ? `?text=${encodeURIComponent(prefill)}` : ""}`;
        }
        case "messenger":
            return `https://m.me/${connection.meta.pageId ?? connection.external_id}${prefill ? `?text=${encodeURIComponent(prefill)}` : ""}`;
        case "instagram":
            return `https://ig.me/m/${connection.handle ?? ""}`;
    }
}
