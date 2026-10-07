import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  conversationAction,
  correctReply,
  getConversation,
  listConversations,
  replyToConversation,
  type ConversationAction,
  type ConversationTab,
} from "./conversationsApi";

const LIVE_REFRESH_MS = 5000;

export const conversationsKey = ["agent", "conversations"] as const;

export function useConversationsQuery(tab: ConversationTab, q: string, channel?: string) {
  return useQuery({
    queryKey: [...conversationsKey, "list", tab, q, channel ?? ""],
    queryFn: () => listConversations({ tab, q: q || undefined, channel }),
    refetchInterval: LIVE_REFRESH_MS,
  });
}

export function useConversationQuery(id: string | null) {
  return useQuery({
    queryKey: [...conversationsKey, "detail", id],
    queryFn: () => getConversation(id!),
    enabled: !!id,
    refetchInterval: LIVE_REFRESH_MS,
  });
}

/** Actions and replies refresh both the list and the open conversation. */
export function useConversationMutations(id: string | null) {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: conversationsKey });

  const action = useMutation({
    mutationFn: ({ action, body }: { action: ConversationAction; body?: Record<string, unknown> }) => conversationAction(id!, action, body),
    onSuccess: refresh,
  });
  const reply = useMutation({ mutationFn: (text: string) => replyToConversation(id!, text), onSuccess: refresh });
  const correct = useMutation({
    mutationFn: (v: { question: string; answer: string; messageId: number }) => correctReply(id!, v.question, v.answer, v.messageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["aiTraining", "corrections"] }),
  });
  return { action, reply, correct };
}
