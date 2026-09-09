import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import { Banner } from "@/components/design/Banner";
import { FormGroup } from "@/components/design/FormGroup";
import Heading from "@/components/design/Heading";
import { TextAreaField } from "@/components/design/TextAreaField";
import Label from "@/components/design/Label";
import { useId } from "react";
import { ToggleField } from "@/components/design/ToggleField";


interface ActionCardProps {
    heading: string,
    content: string,
    isChecked?: boolean,
    onToggle?: () => void
}

function ActionCard({ heading, content, isChecked = false, onToggle }: ActionCardProps) {

    return (
        <div className="flex w-full border border-section-border items-start gap-3 rounded-[10px] p-2.5 text-sm text-black">
            <div className="d-block w-full">
                <Heading size="md">{heading}</Heading>
                <p className="text-gray mt-2 text-sm">{content}</p>
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
    const instructionsId = useId();
    return (
        <>
            <AppSection>
                <Heading size="lg">Prompt Tools</Heading>
                <AppCard padding="sm">
                    <FormGroup gap="md">
                        <TextAreaField
                            label="Human help support"
                            placeholder="E.g: In order to reach to our team send us an email at support@example.com"
                            variant="light"
                        // value={fields.disclaimerMessage}
                        // onChange={(e) => setField("disclaimerMessage", e.target.value)}
                        />
                        <div className="flex flex-col gap-2">
                            <Label htmlFor={instructionsId}>Additional instructions</Label>
                            <div className="flex flex-wrap items-stretch gap-4">
                                <div className="flex min-w-0 flex-[1_1_300px]">
                                    <TextAreaField
                                        id={instructionsId}
                                        wrapperClassName="flex-1"
                                        className="flex-1"
                                        placeholder="Enter your instructions here"
                                        variant="light"
                                    // value={fields.disclaimerMessage}
                                    // onChange={(e) => setField("disclaimerMessage", e.target.value)}
                                    />
                                </div>
                                <div className="flex w-full min-w-0 sm:w-[20%] sm:min-w-[250px] sm:shrink-0">
                                    <Banner
                                        variant="info"
                                        className="p-2"
                                    >
                                        <p className="text-sm font-medium mb-1">Learn how to use prompt tools</p>
                                        <ul className="list-disc space-y-1 text-sm text-gray pl-2.5">
                                            <li className="text-sm text-gray"   >Your name is Karl ai</li>
                                            <li className="text-sm text-gray"   >Your goal is to aware the user to know about the product variants</li>
                                            <li className="text-sm text-gray"   >Stay on brand related copy</li>
                                            <li className="text-sm text-gray"   >Defend the brand loyalty</li>
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
                        isChecked={true}
                        onToggle={() => { }}
                    />
                    <ActionCard
                        heading="Escalate conversations"
                        content="Give Vitalb access to escalate conversations to your support team when needed"
                        isChecked={false}
                        onToggle={() => { }}
                    />
                    <ActionCard
                        heading="Order lookup with custom API"
                        content="Give Vitalb the ability to provide information for the product order and delivery"
                        isChecked={true}
                        onToggle={() => { }}
                    />
                    <ActionCard
                        heading="Skip Conversation"
                        content="Give Vitalb the ability to skip coversation"
                        isChecked={false}
                        onToggle={() => { }}
                    />
                </div>

            </AppSection>
        </>
    )
}
