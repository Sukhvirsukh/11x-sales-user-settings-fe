import { useQuery } from "@tanstack/react-query";
import type { VisibilityFields } from "@/components/shared/chatBox/type";

export const visibilityQueryKey = ["chatbox", "visibility"] as const;

const mockVisibility: VisibilityFields = {
  agentName: "Vitalb", chatFace: null, welcomeMessage: "Hi! How can I help you today?", predefinedMessages: ["Track my order", "Talk to a human", "Return policy"], placeholderMessage: "Ask AI...", primaryColor: "#2F6DF3", notificationColor: "#EF4444", chatBubbleType: "type-bar", showOnMobile: true, showOnDesktopTablet: true, pageVisibility: "all", excludePages: "/checkout", bubbleSize: "56", position: "right", moveLeftRight: 20, moveUpDown: 20, zIndex: 9999, connectWhatsApp: false, connectInstagram: false, leadStatus: "ask-email", leadTitle: "Start a conversation", leadSubtitle: "Leave your email and we will get back to you", sendButtonLabel: "Send", emailPlaceholder: "Enter your email", marketingConsent: "ask-marketing", consentCheckboxDefault: "pre-selected", marketingConsentText: "I agree to receive marketing emails",
};

async function getVisibility(): Promise<VisibilityFields> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ...mockVisibility, predefinedMessages: [...mockVisibility.predefinedMessages] };
}

export function useChatVisibilityQuery() {
  return useQuery({ queryKey: visibilityQueryKey, queryFn: getVisibility, staleTime: Infinity });
}

export function useVisibilityQuery() {
  return useQuery({ queryKey: visibilityQueryKey, queryFn: getVisibility, staleTime: Infinity, refetchOnMount: "always" });
}
