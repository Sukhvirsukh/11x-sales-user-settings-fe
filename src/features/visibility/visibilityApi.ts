import { apiFetch } from "@/lib/api";
import type { VisibilityFields } from "./visibilityTypes";

type VisibilitySaveFields = Omit<VisibilityFields, "chatFace"> & {
    chatFace: string | null;
};

type ChatDesignResponse = VisibilitySaveFields & {
    id?: string;
    userId?: string;
};

type ChatDesignApiResponse = {
    success: boolean;
    message: string;
    data: ChatDesignResponse;
};

const CHAT_FACE_TYPES = new Set(["image/png", "image/jpeg"]);
const CHAT_FACE_MAX_BYTES = 100 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getUploadedImageReference(response: unknown): string | null {
    if (typeof response === "string" && response.trim()) return response;
    if (!isRecord(response)) return null;

    const directReference = response.url ?? response.imageUrl ?? response.path;
    if (typeof directReference === "string" && directReference.trim()) return directReference;

    return getUploadedImageReference(response.data);
}

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

export async function uploadChatFace(image: File): Promise<string> {
    if (!CHAT_FACE_TYPES.has(image.type)) {
        throw new Error("Chat face must be a PNG or JPEG image.");
    }
    if (image.size > CHAT_FACE_MAX_BYTES) {
        throw new Error("Chat face must be 100KB or smaller.");
    }

    const formData = new FormData();
    formData.append("image", image);

    const response = await apiFetch<unknown>("/chat-design/upload-image", {
        method: "POST",
        body: formData,
    });
    const imageReference = getUploadedImageReference(response);

    if (!imageReference) {
        throw new Error("The image upload response did not include an image reference.");
    }

    return imageReference;
}

export async function saveVisibility(values: VisibilitySaveFields): Promise<VisibilityFields> {
    const response = await apiFetch<ChatDesignApiResponse>("/chat-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toVisibilityFields(values)),
    });

    return toVisibilityFields(response.data);
}


export async function resetToDefault() {
    const response = await apiFetch<ChatDesignApiResponse>("/chat-design/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    return toVisibilityFields(response.data);
}
