import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import { FormGroup } from "@/components/design/FormGroup";
import Heading from "@/components/design/Heading";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { usePromptToolsQuery } from "./promptQuery";
import { toFormValues } from "./promptToolsApi";
import type { PromptToolsFormValues } from "./promptType";
import CreateCoupon from "./CreateCoupon";
import EscalateConversationsTool from "./EscalateConversationsTool";
import KnowledgeSearchTool from "./KnowledgeSearchTool";
import OrderLookupTool from "./OrderLookupTool";
import PromptToolsModal from "./PromptToolsModal";
import SkipConversationTool from "./SkipConversationTool";

const DEFAULT_VALUES: PromptToolsFormValues = {
    humanHelpSupport: "",
    additionalInstructions: "",
    knowledgeSearchEnabled: false,
    escalateConversationsEnabled: false,
    orderLookupEnabled: false,
    skipConversationEnabled: false,
};

export function PromptTools() {
    const { data, isLoading, isError } = usePromptToolsQuery();
    const form = useForm<PromptToolsFormValues>({
        defaultValues: DEFAULT_VALUES,
    });
    const { reset, formState: { isDirty } } = form;

    useEffect(() => {
        // The page form holds the prompt-tools document. Each editor writes the
        // field it owns when its save lands.
        if (data && !isDirty) reset(toFormValues(data));
    }, [data, isDirty, reset]);

    if (isLoading) return <div role="status">Loading prompt tools...</div>;
    if (isError) return <div role="alert">Unable to load prompt tools.</div>;

    return (
        <FormProvider {...form}>
            <AppSection>
                <div className="flex items-center justify-between w-full">
                    <Heading size="lg">Prompt Tools</Heading>
                    <PromptToolsModal />
                </div>
                <AppCard padding="sm">
                    <FormGroup gap="sm">
                        <Heading size="md">Customer support</Heading>
                        <AppSection>
                            <p className="text-sm text-content-muted min-h-27.75 max-h-75 overflow-auto">
                                {data?.humanHelpSupport}
                            </p>
                        </AppSection>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col items-stretch gap-4 lg:flex-row">
                                <div className="flex min-w-0 lg:flex-1">
                                    <div className="flex flex-col gap-2 w-full">
                                        <Heading size="md">Additional instructions</Heading>
                                        <AppSection>
                                            <p className="text-sm text-content-muted min-h-27.75 max-h-75 overflow-auto">
                                                {
                                                    data?.additionalInstructions
                                                }
                                            </p>
                                        </AppSection>
                                    </div>
                                </div>
                                <Separator orientation="vertical" className="block max-lg:hidden" />
                                <div className="flex w-full min-w-0 lg:w-1/5 lg:min-w-[220px] lg:shrink-0">
                                    <div className="py-2.5">
                                        <p className="text-sm font-medium mb-2">Learn how to use prompt tools</p>
                                        <ul className="list-disc space-y-1 text-sm text-content-muted pl-2.5">
                                            <li className="text-sm text-content-muted"   >Your name is Karl ai</li>
                                            <li className="text-sm text-content-muted"   >Your goal is to aware the user to know about the product variants</li>
                                            <li className="text-sm text-content-muted"   >Stay on brand related copy</li>
                                            <li className="text-sm text-content-muted"   >Defend the brand loyalty</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormGroup>
                </AppCard>
            </AppSection>

            <AppSection>
                <Heading size="lg">Tools of empower</Heading>
                <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
                    <KnowledgeSearchTool />
                    <EscalateConversationsTool />
                    <OrderLookupTool />
                    <SkipConversationTool />
                    <CreateCoupon />
                </div>

            </AppSection>
        </FormProvider>
    )
}
