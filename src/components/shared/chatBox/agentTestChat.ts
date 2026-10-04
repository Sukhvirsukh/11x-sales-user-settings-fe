import { agentFetch, agentPublicUrl } from "@/lib/agentApi";
import { getCurrentAgentId } from "@/features/agents/agentStore";
import { correctReply } from "@/features/conversations/api/conversationsApi";
import type { ProductRecommendationItem } from "./ProductRecommendation";

interface AgentProductCard {
  handle: string;
  title: string;
  price: number;
  currency?: string;
  image?: string | null;
  url?: string;
  variantId?: string;
}

interface TestChatResponse {
  conversationId: string;
  reply: { id: number; content: string; cards?: { products?: AgentProductCard[] } } | null;
}

/** Sends a preview message to the store's AI agent; test chats are kept out of the inbox. */
export function sendTestMessage(text: string, conversationId: string | null) {
  return agentFetch<TestChatResponse>("/test-chat", { method: "POST", body: { text, conversationId }, notifyOnError: false });
}

export function toRecommendation(card: AgentProductCard): ProductRecommendationItem {
  const price = new Intl.NumberFormat(undefined, { style: "currency", currency: card.currency || "USD" }).format(card.price);
  return { id: card.handle, title: card.title, price, imageUrl: card.image ?? undefined, productUrl: card.url };
}

/** Thumbs up/down on a test reply; the rating shows on the reply wherever it's reviewed. */
export async function rateTestReply(messageId: string, rating: 1 | -1) {
  const agentId = getCurrentAgentId();
  if (!agentId || !/^\d+$/.test(messageId)) return false;
  const response = await fetch(`${agentPublicUrl}/v1/chat/${encodeURIComponent(agentId)}/messages/${messageId}/rating`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating }),
  });
  return response.ok;
}

/** Saves the right answer for a test question as a correction the agent uses from now on. */
export function saveTestCorrection(conversationId: string, question: string, answer: string, messageId: string) {
  return correctReply(conversationId, question, answer, Number(messageId));
}
