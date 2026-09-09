import type { ComponentType } from "react";
import type { ChatBubbleType } from "@/components/design/ChatBubbleTypeSelector";

export type PageVisibilityMode = "all" | "specific";
export type BubblePosition = "left" | "right";
export type LeadStatus = "ask-email" | "dont-ask";
export type MarketingConsent = "ask-marketing" | "dont-ask-marketing";
export type ConsentCheckboxDefault = "pre-selected" | "not-selected";

export interface VisibilityFields {
    aiAgentName: string;
    chatFace: File | string | null;
    welcomeMessage: string;
    predefinedMessages: string[];
    placeholderMessage: string;
    disclaimerMessage: string;
    primaryColor: string;
    notificationColor: string; //add
    chatBubbleType: ChatBubbleType;//add
    showOnMobile: boolean; //add
    showOnDesktopTablet: boolean;//add
    pageVisibility: PageVisibilityMode;//add
    excludePages: string;
    bubbleSize: string;//add
    position: BubblePosition; //corner
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


export interface VisibilityStore {
    fields: VisibilityFields;
    duplicateFields: VisibilityFields;
    isDirty: boolean;
    hasLoaded: boolean;
    setField: <K extends keyof VisibilityFields>(
        key: K,
        value: VisibilityFields[K],
    ) => void;
    hydrate: (fields: VisibilityFields) => void;
    save: () => void;
    discard: () => void;
    resetToDefault: () => void;
}

export interface AccordionTab {
    id: string;
    label: string;
    content: ComponentType;
}
