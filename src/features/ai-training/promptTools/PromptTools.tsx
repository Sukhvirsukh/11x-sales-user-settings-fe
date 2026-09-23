import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import { Banner } from "@/components/design/Banner";
import { FormGroup } from "@/components/design/FormGroup";
import Heading from "@/components/design/Heading";
import { TextAreaField } from "@/components/design/TextAreaField";
import { ToggleField } from "@/components/design/ToggleField";
import { UnSavedChangesBar } from "@/components/shared/unsavedChangesBar";
import { toast } from "@/components/ui/toast";
import { useCan } from "@/features/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { promptToolsQueryKey, usePromptToolsQuery } from "./promptQuery";
import { savePromptTools } from "./promptToolsApi";
import type { PromptToolsFormValues, PromptToolsResponse } from "./promptType";

const DEFAULT_VALUES: PromptToolsFormValues = {
    humanHelpSupport: "",
    additionalInstructions: "",
    knowledgeSearchEnabled: false,
    escalateConversationsEnabled: false,
    orderLookupEnabled: false,
    skipConversationEnabled: false,
};

function toFormValues(data: PromptToolsResponse): PromptToolsFormValues {
    return {
        humanHelpSupport: data.humanHelpSupport ?? "",
        additionalInstructions: data.additionalInstructions ?? "",
        knowledgeSearchEnabled: data.knowledgeSearchEnabled,
        escalateConversationsEnabled: data.escalateConversationsEnabled,
        orderLookupEnabled: data.orderLookupEnabled,
        skipConversationEnabled: data.skipConversationEnabled,
    };
}

interface ActionCardProps {
    heading: string,
    content: string,
    isChecked?: boolean,
    onToggle?: (pressed: boolean) => void
}

function ActionCard({ heading, content, isChecked = false, onToggle }: ActionCardProps) {

    return (
        <div className="flex w-full border border-section-border items-start gap-3 rounded-[10px] p-2.5 text-sm text-content-strong">
            <div className="d-block w-full">
                <Heading size="md">{heading}</Heading>
                <p className="text-content-muted mt-2 text-sm">{content}</p>
            </div>
            {onToggle && <ToggleField
                pressed={isChecked}
                onPressedChange={onToggle}
                showText={true}
                toggleVariant="button"
                aria-label={heading}
            />}
        </div>
    )
}

export function PromptTools() {
    const { data, isLoading, isError } = usePromptToolsQuery();
    const canSavePromptTools = useCan("aiTraining.create");
    const queryClient = useQueryClient();
    const form = useForm<PromptToolsFormValues>({
        defaultValues: DEFAULT_VALUES,
    });
    const { register, reset, setValue, watch } = form;
    const saveMutation = useMutation({
        mutationFn: (values: PromptToolsFormValues) => {
            if (!canSavePromptTools) {
                return Promise.reject(new Error("You do not have permission to change prompt tools."));
            }
            return savePromptTools(values);
        },
        onSuccess: (savedData) => {
            queryClient.setQueryData(promptToolsQueryKey, savedData);
            reset(toFormValues(savedData));
            toast.add({
                type: "success",
                title: "Prompt tools saved",
                description: "Your prompt tools have been updated.",
            });
        },
    });

    useEffect(() => {
        if (data) reset(toFormValues(data));
    }, [data, reset]);

    if (isLoading) return <div role="status">Loading prompt tools...</div>;
    if (isError) return <div role="alert">Unable to load prompt tools.</div>;

    return (
        <>
            <AppSection>
                <Heading size="lg">Prompt Tools</Heading>
                <AppCard padding="sm">
                    <FormGroup gap="md">
                        <TextAreaField
                            label="Human help support"
                            placeholder="E.g: In order to reach to our team send us an email at support@example.com"
                            {...register("humanHelpSupport")}
                        />
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-stretch gap-4">
                                <div className="flex min-w-0 flex-[1_1_300px]">
                                    <TextAreaField
                                        label="Additional instructions"
                                        wrapperClassName="flex-1"
                                        className="flex-1"
                                        placeholder="Enter your instructions here"
                                        {...register("additionalInstructions")}
                                    />
                                </div>
                                <div className="flex w-full min-w-0 sm:w-[20%] sm:min-w-[250px] sm:shrink-0">
                                    <Banner
                                        variant="info"
                                        className="p-2"
                                    >
                                        <p className="text-sm font-medium mb-1">Learn how to use prompt tools</p>
                                        <ul className="list-disc space-y-1 text-sm text-content-muted pl-2.5">
                                            <li className="text-sm text-content-muted"   >Your name is Karl ai</li>
                                            <li className="text-sm text-content-muted"   >Your goal is to aware the user to know about the product variants</li>
                                            <li className="text-sm text-content-muted"   >Stay on brand related copy</li>
                                            <li className="text-sm text-content-muted"   >Defend the brand loyalty</li>
                                        </ul>
                                    </Banner>
                                </div>
                            </div>
                        </div>
                    </FormGroup>
                </AppCard>
            </AppSection>

            <AppSection>
                <Heading size="lg">Tools of empower</Heading>
                <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                    <ActionCard
                        heading="Knowledge search"
                        content="Give Vitalb the ability to perform the functionality"
                        isChecked={watch("knowledgeSearchEnabled")}
                        onToggle={(enabled) => setValue("knowledgeSearchEnabled", enabled, { shouldDirty: true })}
                    />
                    <ActionCard
                        heading="Escalate conversations"
                        content="Give Vitalb access to escalate conversations to your support team when needed"
                        isChecked={watch("escalateConversationsEnabled")}
                        onToggle={(enabled) => setValue("escalateConversationsEnabled", enabled, { shouldDirty: true })}
                    />
                    <ActionCard
                        heading="Order lookup with custom API"
                        content="Give Vitalb the ability to provide information for the product order and delivery"
                        isChecked={watch("orderLookupEnabled")}
                        onToggle={(enabled) => setValue("orderLookupEnabled", enabled, { shouldDirty: true })}
                    />
                    <ActionCard
                        heading="Skip Conversation"
                        content="Give Vitalb the ability to skip coversation"
                        isChecked={watch("skipConversationEnabled")}
                        onToggle={(enabled) => setValue("skipConversationEnabled", enabled, { shouldDirty: true })}
                    />
                </div>

            </AppSection>
            {canSavePromptTools && <UnSavedChangesBar
                isDirty={form.formState.isDirty}
                saving={saveMutation.isPending}
                saveDisabled={!canSavePromptTools}
                placement="fixed"
                onSave={async () => {
                    if (!canSavePromptTools) return;
                    await saveMutation.mutateAsync(form.getValues());
                }}
                onDiscard={() => reset(data ? toFormValues(data) : DEFAULT_VALUES)}
            />}
        </>
    )
}
