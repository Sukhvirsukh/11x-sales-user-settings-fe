import { useState } from "react";
import { useFormContext } from "react-hook-form";

import ActionModal from "./ActionModal";
import { useSavePromptTools } from "./useSavePromptTools";
import type { PromptToolsFormValues } from "./promptType";

type SkipConversationValues = {
    additionalInformation: string;
};

const DEFAULT_VALUES: SkipConversationValues = { additionalInformation: "" };

/** Placeholder: same bullets as the discount tool until this tool gets its own. */
const CORE_PROMPTS = {
    title: "Core prompt",
    items: [
        "Use this skill to create a unique, one time percentage discount for the customer.",
        "You can create a discount to encourage the user to purchase more",
    ],
};

/**
 * Skip conversation tool — owns its draft, its switch and its save request.
 *
 * The switch itself lives in the page form because the prompt-tools endpoint
 * replaces the whole document: this tool sends the current document with its
 * own flag.
 */
export default function SkipConversationTool() {
    const { getValues, watch } = useFormContext<PromptToolsFormValues>();
    const { save, saving, canSave } = useSavePromptTools();
    const [savedValues, setSavedValues] = useState<SkipConversationValues>(DEFAULT_VALUES);

    async function persistTool(values: SkipConversationValues, enabled: boolean) {
        const saved = await save({ ...getValues(), skipConversationEnabled: enabled });
        // Keep the draft so reopening the dialog shows what was last saved.
        if (saved) setSavedValues(values);
        return saved;
    }

    return (
        <ActionModal<SkipConversationValues>
            title="Skip conversation"
            heading="Skip conversation"
            content="Give Vitalb the ability to skip conversation"
            fields={[
                {
                    name: "additionalInformation",
                    label: "Additional information",
                    placeholder: "Tell Vitalb when it should end the conversation",
                },
            ]}
            corePrompts={CORE_PROMPTS}
            defaultValues={savedValues}
            isChecked={watch("skipConversationEnabled")}
            saving={saving}
            canSave={canSave}
            onSave={persistTool}
        />
    );
}
