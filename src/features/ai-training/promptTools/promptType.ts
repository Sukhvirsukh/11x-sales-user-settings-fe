export interface PromptToolsResponse {
    humanHelpSupport?: string;
    additionalInstructions?: string;
    knowledgeSearchEnabled: boolean;
    escalateConversationsEnabled: boolean;
    orderLookupEnabled: boolean;
    skipConversationEnabled: boolean;
}

interface PromptToolApiItem {
    label: string;
    description: string;
    enabled: boolean;
}

export interface PromptToolsApiResponse {
    humanHelpSupport?: string;
    additionalInstructions?: string;
    tools: {
        knowledgeSearch: PromptToolApiItem;
        escalateConversations: PromptToolApiItem;
        orderLookup: PromptToolApiItem;
        skipConversation: PromptToolApiItem;
    };
}

export interface PromptToolsFormValues {
    humanHelpSupport: string;
    additionalInstructions: string;
    knowledgeSearchEnabled: boolean;
    escalateConversationsEnabled: boolean;
    orderLookupEnabled: boolean;
    skipConversationEnabled: boolean;
}
