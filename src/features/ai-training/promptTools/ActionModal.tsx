import { useState, type ReactNode } from "react";
import { useForm, type DefaultValues, type FieldValues, type Path } from "react-hook-form";

import { FormGroup } from "@/components/design/FormGroup";
import Heading from "@/components/design/Heading";
import { InputField } from "@/components/design/InputField";
import Modal from "@/components/design/Modal";
import { TextAreaField } from "@/components/design/TextAreaField";
import { ToggleField } from "@/components/design/ToggleField";
import { Field, FieldTitle } from "@/components/ui/field";
import List from "@/components/shared/List";
import { cn } from "@/lib/utils";

/** One field of the tool's own form, rendered inside the dialog. */
export interface ActionModalField<TValues extends FieldValues = FieldValues> {
    name: Path<TValues>;
    label: string;
    placeholder?: string;
    /** Defaults to a multi-line textarea. */
    kind?: "input" | "textarea";
}

/** Read-only bullets shown under the fields, e.g. the prompt a tool ships with. */
export interface ActionModalPromptList {
    title: string;
    items: string[];
}

export interface ActionModalProps<TValues extends FieldValues = FieldValues> {
    /** Dialog heading. */
    title: string;
    /** Heading of the card in the "Tools of empower" grid. */
    heading: string;
    /** Description of the card in the grid. */
    content: string;
    fields?: ActionModalField<TValues>[];
    corePrompts?: ActionModalPromptList;
    defaultValues?: DefaultValues<TValues>;
    /**
     * Persists the tool and resolves `true` once the save landed. The dialog
     * closes only on success, so a failed request keeps the draft open.
     * `enabled` is the draft state of the dialog's toggle. Owned by the tool
     * component, never by this one.
     */
    onSave?: (values: TValues, enabled: boolean) => Promise<boolean> | boolean;
    saving?: boolean;
    /** Editors without the change permission may open the dialog but not save. */
    canSave?: boolean;
    /** Primary action label while idle. Defaults to "Save". */
    saveLabel?: string;
    /**
     * Saved state of the tool's switch. The dialog drafts it and hands it to
     * `onSave`, so closing without saving leaves the tool untouched. Omit it
     * when the tool has no switch and the dialog renders none.
     */
    isChecked?: boolean;
    /** Extra dialog content rendered under the fields. */
    children?: ReactNode;
    className?: string;
}

export interface ActionCardProps {
    heading: string;
    content: string;
    /** Enabled state of the tool, shown by the toggle. */
    isChecked?: boolean;
    /** Pressing the toggle opens the tool dialog. */
    onToggle?: (pressed: boolean) => void;
    className?: string;
}

/**
 * Grid card for one tool. The toggle is the only affordance: it opens the
 * dialog (where the tool is switched on or off) instead of writing state, so
 * enabling a tool always goes through the same save path.
 */
export function ActionCard({
    heading,
    content,
    isChecked = false,
    onToggle,
    className,
}: ActionCardProps) {
    return (
        <div
            className={cn(
                "flex w-full items-start gap-3 rounded-[10px] border border-section-border p-2.5 text-sm text-content-strong",
                className,
            )}
        >
            <div className="flex min-w-0 flex-1 flex-col">
                <Heading size="md">{heading}</Heading>
                <p className="mt-2 text-sm text-content-muted">{content}</p>
            </div>

            {onToggle && (
                <ToggleField
                    pressed={isChecked}
                    onPressedChange={onToggle}
                    showText
                    toggleVariant="button"
                    aria-label={heading}
                />
            )}
        </div>
    );
}

/**
 * Common tool dialog: a card in the grid plus a modal that edits the tool.
 *
 * The dialog owns a form for its own fields and hands the collected values to
 * `onSave`, which each tool component implements (that is where the request
 * lives). Keeping the fields off the page-level prompt-tools form means a tool
 * draft can never leak into the `PUT /training/prompt-tools` body. The
 * enable/disable switch is drafted here too and only reaches the tool's state
 * when the save lands.
 */
export default function ActionModal<TValues extends FieldValues = FieldValues>({
    title,
    heading,
    content,
    fields,
    corePrompts,
    defaultValues,
    onSave,
    saving = false,
    canSave = true,
    saveLabel = "Save",
    isChecked,
    children,
    className,
}: ActionModalProps<TValues>) {
    const [isOpen, setIsOpen] = useState(false);
    const [enabled, setEnabled] = useState(isChecked ?? false);
    const { register, handleSubmit, reset } = useForm<TValues>({ defaultValues });
    const hasToggle = isChecked !== undefined;

    const openModal = () => {
        // Every open starts from the saved values, so a dialog closed without
        // saving leaves nothing behind.
        reset(defaultValues);
        setEnabled(isChecked ?? false);
        setIsOpen(true);
    };

    const submit = handleSubmit(async (values) => {
        if (!onSave) {
            setIsOpen(false);
            return;
        }
        if (await onSave(values, enabled)) setIsOpen(false);
    });

    return (
        <>
            {/* The card toggle only opens the dialog; the switch itself lives inside. */}
            <ActionCard
                heading={heading}
                content={content}
                isChecked={isChecked}
                onToggle={openModal}
                className={className}
            />

            <Modal
                open={isOpen}
                onOpenChange={(open) => {
                    if (!saving) setIsOpen(open);
                }}
                title={title}
                primaryAction={{
                    label: saving ? "Saving..." : saveLabel,
                    onClick: submit,
                    disabled: saving || !canSave,
                }}
                closeAction={{ label: "Cancel", disabled: saving }}
            >
                <FormGroup gap="sm">
                    {hasToggle ? (
                        <Field orientation="horizontal">
                            <FieldTitle>{enabled ? "Disable" : "Enable"} tool</FieldTitle>
                            <ToggleField
                                pressed={enabled}
                                onPressedChange={setEnabled}
                                showText
                                toggleVariant="button"
                                aria-label={`Enable ${heading}`}
                            />
                        </Field>
                    ) : null}

                    {fields?.map((field) => {
                        const sharedProps = {
                            label: field.label,
                            placeholder: field.placeholder,
                            labelClassName: "text-sm font-medium",
                            ...register(field.name),
                        };

                        return field.kind === "input" ? (
                            <InputField key={field.name} {...sharedProps} />
                        ) : (
                            <TextAreaField key={field.name} {...sharedProps} />
                        );
                    })}

                    {corePrompts ? (
                        <List
                            title={corePrompts.title}
                            titleClassName="text-sm font-medium"
                            listClassName="text-sm text-content-muted space-y-0 disc list-disc pl-2"
                            listItemClassName="my-0"
                            list={corePrompts.items}
                        />
                    ) : null}

                    {children}
                </FormGroup>
            </Modal>
        </>
    );
}
