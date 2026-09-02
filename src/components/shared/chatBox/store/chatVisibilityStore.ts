import { create } from "zustand";
import type { ChatBubbleType } from "@/components/design/ChatBubbleTypeSelector";

export type PageVisibilityMode = "all" | "specific";
export type BubblePosition = "left" | "right";
export type LeadStatus = "ask-email" | "dont-ask";
export type MarketingConsent = "ask-marketing" | "dont-ask-marketing";
export type ConsentCheckboxDefault = "pre-selected" | "not-selected";

export interface VisibilityFields {
    agentName: string;
    chatFace: File | string | null;
    welcomeMessage: string;
    predefinedMessages: string[];
    placeholderMessage: string;
    primaryColor: string;
    notificationColor: string;
    chatBubbleType: ChatBubbleType;
    showOnMobile: boolean;
    showOnDesktopTablet: boolean;
    pageVisibility: PageVisibilityMode;
    excludePages: string;
    bubbleSize: string;
    position: BubblePosition;
    moveLeftRight: number;
    moveUpDown: number;
    zIndex: number;
    connectWhatsApp: boolean;
    connectInstagram: boolean;
    leadStatus: LeadStatus;
    leadTitle: string;
    leadSubtitle: string;
    sendButtonLabel: string;
    emailPlaceholder: string;
    marketingConsent: MarketingConsent;
    consentCheckboxDefault: ConsentCheckboxDefault;
    marketingConsentText: string;
}

export const defaultVisibilityFields: VisibilityFields = {
    agentName: "Vitalb",
    chatFace: null,
    welcomeMessage: "Hi! How can I help you today?",
    predefinedMessages: ["Track my order", "Talk to a human", "Return policy"],
    placeholderMessage: "Ask AI...",
    primaryColor: "#2F6DF3",
    notificationColor: "#EF4444",
    chatBubbleType: "type-bar",
    showOnMobile: true,
    showOnDesktopTablet: true,
    pageVisibility: "all",
    excludePages: "/checkout",
    bubbleSize: "56",
    position: "right",
    moveLeftRight: 20,
    moveUpDown: 20,
    zIndex: 9999,
    connectWhatsApp: false,
    connectInstagram: false,
    leadStatus: "ask-email",
    leadTitle: "Start a conversation",
    leadSubtitle: "Leave your email and we will get back to you",
    sendButtonLabel: "Send",
    emailPlaceholder: "Enter your email",
    marketingConsent: "ask-marketing",
    consentCheckboxDefault: "pre-selected",
    marketingConsentText: "I agree to receive marketing emails",
};

function cloneFields(fields: VisibilityFields): VisibilityFields {
    return {
        ...fields,
        predefinedMessages: [...fields.predefinedMessages],
    };
}

interface VisibilityStore {
    fields: VisibilityFields;
    savedFields: VisibilityFields;
    isDirty: boolean;
    setField: <K extends keyof VisibilityFields>(
        key: K,
        value: VisibilityFields[K],
    ) => void;
    save: () => void;
    discard: () => void;
    resetToDefault: () => void;
}

export const useVisibilityStore = create<VisibilityStore>((set) => ({
    fields: cloneFields(defaultVisibilityFields),
    savedFields: cloneFields(defaultVisibilityFields),
    isDirty: false,

    setField: (key, value) =>
        set((state) => ({
            fields: { ...state.fields, [key]: value },
            isDirty: true,
        })),

    save: () =>
        set((state) => ({
            savedFields: cloneFields(state.fields),
            isDirty: false,
        })),

    discard: () =>
        set((state) => ({
            fields: cloneFields(state.savedFields),
            isDirty: false,
        })),

    resetToDefault: () =>
        set({
            fields: cloneFields(defaultVisibilityFields),
            savedFields: cloneFields(defaultVisibilityFields),
            isDirty: false,
        }),
}));
