import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

import { FormGroup } from "@/components/design/FormGroup";
import Modal from "@/components/design/Modal";
import { TextAreaField } from "@/components/design/TextAreaField";
import { Button } from "@/components/ui/button";

import { useSavePromptTools } from "./useSavePromptTools";
import type { PromptToolsFormValues } from "./promptType";

type PromptToolsValues = {
    humanHelpSupport: string;
    additionalInstructions: string;
};

/**
 * Edits the free-text prompt fields from a modal.
 *
 * The dialog keeps its own draft, seeded from the page form each time it opens,
 * and closes only once the save landed — a failure keeps the draft in place.
 * The endpoint replaces the whole document, so the save carries the tool
 * switches along with the text.
 */
export default function PromptToolsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const { getValues } = useFormContext<PromptToolsFormValues>();
    const { save, saving, canSave } = useSavePromptTools();
    const form = useForm<PromptToolsValues>({
        defaultValues: { humanHelpSupport: "", additionalInstructions: "" },
    });

    const handleOpenChange = (open: boolean) => {
        if (saving) return;
        // Start from the saved document, so Cancel discards.
        if (open) {
            const document = getValues();
            form.reset({
                humanHelpSupport: document.humanHelpSupport,
                additionalInstructions: document.additionalInstructions,
            });
        }
        setIsOpen(open);
    };

    const submit = form.handleSubmit(async (values) => {
        if (await save({ ...getValues(), ...values })) setIsOpen(false);
    });

    return (
        <Modal
            open={isOpen}
            onOpenChange={handleOpenChange}
            title="Prompt tools"
            primaryAction={{
                label: saving ? "Saving..." : "Save",
                onClick: submit,
                disabled: saving || !canSave,
            }}
            closeAction={{ label: "Cancel", disabled: saving }}
            trigger={<Button disabled={!canSave}>Update</Button>}
        >
            <FormGroup gap="sm">
                <TextAreaField
                    label="Human help support"
                    placeholder="E.g: In order to reach to our team send us an email at support@example.com"
                    {...form.register("humanHelpSupport")}
                />
                <TextAreaField
                    label="Additional instructions"
                    placeholder="Enter your instructions here"
                    {...form.register("additionalInstructions")}
                />
            </FormGroup>
        </Modal>
    );
}
