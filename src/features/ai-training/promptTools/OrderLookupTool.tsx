import { useState } from "react";
import { useFormContext } from "react-hook-form";

import ActionModal from "./ActionModal";
import { useSavePromptTools } from "./useSavePromptTools";
import type { PromptToolsFormValues } from "./promptType";

type OrderLookupValues = {
    additionalInformation: string;
};

const DEFAULT_VALUES: OrderLookupValues = { additionalInformation: "" };

/** Placeholder: same bullets as the discount tool until this tool gets its own. */
const CORE_PROMPTS = {
    title: "Core prompt",
    items: [
        "Use this skill to create a unique, one time percentage discount for the customer.",
        "You can create a discount to encourage the user to purchase more",
    ],
};

/**
 * Order lookup tool — owns its draft, its switch and its save request.
 *
 * The switch itself lives in the page form because the prompt-tools endpoint
 * replaces the whole document: this tool sends the current document with its
 * own flag.
 */
export default function OrderLookupTool() {
    const { getValues, watch } = useFormContext<PromptToolsFormValues>();
    const { save, saving, canSave } = useSavePromptTools();
    const [savedValues, setSavedValues] = useState<OrderLookupValues>(DEFAULT_VALUES);

    async function persistTool(values: OrderLookupValues, enabled: boolean) {
        const saved = await save({ ...getValues(), orderLookupEnabled: enabled });
        // Keep the draft so reopening the dialog shows what was last saved.
        if (saved) setSavedValues(values);
        return saved;
    }

    return (
        <ActionModal<OrderLookupValues>
            title="Order lookup with custom API"
            heading="Order lookup with custom API"
            content="Give Vitalb the ability to provide information for the product order and delivery"
            fields={[
                {
                    name: "additionalInformation",
                    label: "Additional information",
                    placeholder: "Describe the order and delivery details to return",
                },
            ]}
            corePrompts={CORE_PROMPTS}
            defaultValues={savedValues}
            isChecked={watch("orderLookupEnabled")}
            saving={saving}
            canSave={canSave}
            onSave={persistTool}
        />
    );
}
