export interface PromptToolsResponse {
    humanHelpSupport?: string;
    additionalInstructions?: string;
    knowledgeSearchEnabled: boolean;
    escalateConversationsEnabled: boolean;
    orderLookupEnabled: boolean;
    skipConversationEnabled: boolean;
}

export interface PromptToolsApiResponse {
    humanHelpSupport?: string;
    additionalInstructions?: string;
    knowledgeSearch?: { enabled?: boolean };
    escalateConversations?: { enabled?: boolean };
    orderLookup?: { enabled?: boolean };
    skipConversation?: { enabled?: boolean };
}

export interface PromptToolsFormValues {
    humanHelpSupport: string;
    additionalInstructions: string;
    knowledgeSearchEnabled: boolean;
    escalateConversationsEnabled: boolean;
    orderLookupEnabled: boolean;
    skipConversationEnabled: boolean;
}
