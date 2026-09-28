import { agentFetch } from "@/lib/agentApi";
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
