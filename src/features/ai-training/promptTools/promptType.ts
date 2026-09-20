export interface PromptToolsResponse {
    humanHelpSupport?: string;
    additionalInstructions?: string;
    knowledgeSearchEnabled: boolean;
    escalateConversationsEnabled: boolean;
    orderLookupEnabled: boolean;
    skipConversationEnabled: boolean;
}

export interface PromptToolsFormValues {
    humanHelpSupport: string;
    additionalInstructions: string;
    knowledgeSearchEnabled: boolean;
    escalateConversationsEnabled: boolean;
    orderLookupEnabled: boolean;
    skipConversationEnabled: boolean;
}
