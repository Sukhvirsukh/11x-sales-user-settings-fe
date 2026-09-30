import { useState } from "react";
import { useFormContext } from "react-hook-form";

import ActionModal from "./ActionModal";
import { useSavePromptTools } from "./useSavePromptTools";
import type { PromptToolsFormValues } from "./promptType";

type KnowledgeSearchValues = {
    additionalInformation: string;
};

const DEFAULT_VALUES: KnowledgeSearchValues = { additionalInformation: "" };

/** Placeholder: same bullets as the discount tool until this tool gets its own. */
const CORE_PROMPTS = {
    title: "Core prompt",
    items: [
        "Use this skill to create a unique, one time percentage discount for the customer.",
        "You can create a discount to encourage the user to purchase more",
    ],
};

/**
 * Knowledge search tool — owns its draft, its switch and its save request.
 *
 * The switch itself lives in the page form because the prompt-tools endpoint
 * replaces the whole document: this tool sends the current document with its
 * own flag.
 */
export default function KnowledgeSearchTool() {
    const { getValues, watch } = useFormContext<PromptToolsFormValues>();
    const { save, saving, canSave } = useSavePromptTools();
    const [savedValues, setSavedValues] = useState<KnowledgeSearchValues>(DEFAULT_VALUES);

    async function persistTool(values: KnowledgeSearchValues, enabled: boolean) {
        const saved = await save({ ...getValues(), knowledgeSearchEnabled: enabled });
        // Keep the draft so reopening the dialog shows what was last saved.
        if (saved) setSavedValues(values);
        return saved;
    }

    return (
        <ActionModal<KnowledgeSearchValues>
            title="Knowledge search"
            heading="Knowledge search"
            content="Give Vitalb the ability to perform the functionality"
            fields={[
                {
                    name: "additionalInformation",
                    label: "Additional information",
                    placeholder: "Enter additional information",
                },
            ]}
            corePrompts={CORE_PROMPTS}
            defaultValues={savedValues}
            isChecked={watch("knowledgeSearchEnabled")}
            saving={saving}
            canSave={canSave}
            onSave={persistTool}
        />
    );
}
