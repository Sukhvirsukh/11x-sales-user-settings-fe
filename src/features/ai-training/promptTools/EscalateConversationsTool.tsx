import { useState } from "react";
import { useFormContext } from "react-hook-form";

import ActionModal from "./ActionModal";
import { useSavePromptTools } from "./useSavePromptTools";
import type { PromptToolsFormValues } from "./promptType";

type EscalateConversationsValues = {
    additionalInformation: string;
};

const DEFAULT_VALUES: EscalateConversationsValues = { additionalInformation: "" };

/** Placeholder: same bullets as the discount tool until this tool gets its own. */
const CORE_PROMPTS = {
    title: "Core prompt",
    items: [
        "Use this skill to create a unique, one time percentage discount for the customer.",
        "You can create a discount to encourage the user to purchase more",
    ],
};

/**
 * Escalate conversations tool — owns its draft, its switch and its save request.
 *
 * The switch itself lives in the page form because the prompt-tools endpoint
 * replaces the whole document: this tool sends the current document with its
 * own flag.
 */
export default function EscalateConversationsTool() {
    const { getValues, watch } = useFormContext<PromptToolsFormValues>();
    const { save, saving, canSave } = useSavePromptTools();
    const [savedValues, setSavedValues] = useState<EscalateConversationsValues>(DEFAULT_VALUES);

    async function persistTool(values: EscalateConversationsValues, enabled: boolean) {
        const saved = await save({ ...getValues(), escalateConversationsEnabled: enabled });
        // Keep the draft so reopening the dialog shows what was last saved.
        if (saved) setSavedValues(values);
        return saved;
    }

    return (
        <ActionModal<EscalateConversationsValues>
            title="Escalate conversations"
            heading="Escalate conversations"
            content="Give Vitalb access to escalate conversations to your support team when needed"
            fields={[
                {
                    name: "additionalInformation",
                    label: "Additional information",
                    placeholder: "Tell Vitalb when to hand a conversation over to support",
                },
            ]}
            corePrompts={CORE_PROMPTS}
            defaultValues={savedValues}
            isChecked={watch("escalateConversationsEnabled")}
            saving={saving}
            canSave={canSave}
            onSave={persistTool}
        />
    );
}
