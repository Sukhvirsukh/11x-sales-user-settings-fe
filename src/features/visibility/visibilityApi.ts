import { apiFetch } from "@/lib/api";
import type { VisibilityFields } from "./visibilityTypes";

type ChatDesignResponse = VisibilityFields & {
    id?: string;
    userId?: string;
};

type ChatDesignApiResponse = {
    success: boolean;
    message: string;
    data: ChatDesignResponse;
};

function toVisibilityFields(response: ChatDesignResponse): VisibilityFields {
    return {
        aiAgentName: response.aiAgentName,
        chatFace: response.chatFace,
        welcomeMessage: response.welcomeMessage,
        predefinedMessages: response.predefinedMessages,
        placeholderMessage: response.placeholderMessage,
        disclaimerMessage: response.disclaimerMessage,
        primaryColor: response.primaryColor,
        notificationColor: response.notificationColor,
        chatBubbleType: response.chatBubbleType,
        showOnMobile: response.showOnMobile,
        showOnDesktopTablet: response.showOnDesktopTablet,
        pageVisibility: response.pageVisibility,
        excludePages: response.excludePages,
        bubbleSize: response.bubbleSize,
        position: response.position,
        moveLeftRight: response.moveLeftRight,
        moveUpDown: response.moveUpDown,
        zIndex: response.zIndex,
        connectWhatsApp: response.connectWhatsApp,
        connectInstagram: response.connectInstagram,
        leadStatus: response.leadStatus,
        leadTitle: response.leadTitle,
        leadSubtitle: response.leadSubtitle,
        sendButtonLabel: response.sendButtonLabel,
        emailPlaceholder: response.emailPlaceholder,
        marketingConsent: response.marketingConsent,
        consentCheckboxDefault: response.consentCheckboxDefault,
        marketingConsentText: response.marketingConsentText,
    };
}

export async function getVisibility(): Promise<VisibilityFields> {
    const response = await apiFetch<ChatDesignApiResponse>("/chat-design");
    return toVisibilityFields(response.data);
}

export async function saveVisibility(values: VisibilityFields): Promise<VisibilityFields> {
    const response = await apiFetch<ChatDesignApiResponse>("/chat-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toVisibilityFields(values)),
    });

    return toVisibilityFields(response.data);
}
