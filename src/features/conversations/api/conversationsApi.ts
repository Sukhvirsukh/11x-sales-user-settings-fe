import { agentFetch } from "@/lib/agentApi";

export type ConversationTab = "active" | "escalated" | "mine" | "archived";

export interface AgentConversation {
  id: string;
  channel: string;
  status: "active" | "escalated" | "resolved";
  manual_mode: boolean;
  archived: boolean;
  unread: boolean;
  assignee: string | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  start_page: string | null;
  last_page: string | null;
  locale: string | null;
  summary: string | null;
  sentiment: string | null;
  preview?: string | null;
  orders?: number;
  last_message_at: string | null;
  created_at: string;
  meta: Record<string, unknown>;
}

export interface AgentMessage {
  id: number;
  role: "user" | "assistant" | "human" | "system";
  content: string;
  sender: string | null;
  rating: number | null;
  model: string | null;
  cost: number | null;
  created_at: string;
}

export interface ConversationDetail {
  conversation: AgentConversation;
  messages: AgentMessage[];
  orders: { id: string; total: number; currency: string; influence: string | null }[];
  shareUrl: string;
}

export type ConversationAction = "takeover" | "handback" | "resolve" | "unresolve" | "archive" | "unread" | "assign" | "notes";

export function listConversations(params: { tab: ConversationTab; q?: string; channel?: string }) {
  const search = new URLSearchParams({ tab: params.tab });
  if (params.q) search.set("q", params.q);
  if (params.channel) search.set("channel", params.channel);
  return agentFetch<{ conversations: AgentConversation[]; counts: Record<string, number> }>(`/conversations?${search}`);
}

export function getConversation(id: string) {
  return agentFetch<ConversationDetail>(`/conversations/${encodeURIComponent(id)}`, { notifyOnError: false });
}

export function conversationAction(id: string, action: ConversationAction, body: Record<string, unknown> = {}) {
  return agentFetch<AgentConversation>(`/conversations/${encodeURIComponent(id)}/${action}`, { method: "POST", body });
}

export function replyToConversation(id: string, text: string) {
  return agentFetch<AgentMessage>(`/conversations/${encodeURIComponent(id)}/reply`, { method: "POST", body: { text } });
}

export function correctReply(id: string, question: string, answer: string, messageId: number) {
  return agentFetch(`/conversations/${encodeURIComponent(id)}/correction`, {
    method: "POST",
    body: { type: "knowledge", question, answer, messageId },
  });
}
