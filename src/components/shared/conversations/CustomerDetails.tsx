import { Fragment } from "react"
import Heading from "@/components/design/Heading"
import { SelectField } from "@/components/design/SelectField"
import CopyField from "@/components/shared/CopyField"
import { noop } from "@/lib/utils"
import AddNote from "./AddNote"
import { CollapsibleSection } from "./CollapsibleSection"
import { type Conversation } from "./conversationData"

export function CustomerDetails({ conversation }: { conversation: Conversation }) {
    const details = [
        { label: "Name", value: conversation.name },
        { label: "Email", value: conversation.email },
        { label: "Phone", value: conversation.phone },
        { label: "Location", value: conversation.location },
    ]

    return (
        <div className="flex min-w-0 flex-col gap-4">
            <div>
                <div className="mb-2.5 flex items-center justify-between gap-2">
                    <Heading size="md" className="font-semibold">Assignee</Heading>
                    <AddNote />
                </div>
                <SelectField
                    value="vitalb-ai"
                    onValueChange={noop}
                    placeholder="Assign"
                    options={[{ value: "vitalb-ai", label: "Vitalb ai" }]}
                />
            </div>

            <CollapsibleSection title="Customer details" contentClassName="mt-3">
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                    {details.map((detail) => (
                        <Fragment key={detail.label}>
                            <dt className="text-content-muted">{detail.label}</dt>
                            <dd className="truncate text-foreground">{detail.value}</dd>
                        </Fragment>
                    ))}
                </dl>
            </CollapsibleSection>

            <CollapsibleSection title="Share URL" contentClassName="mt-2.5">
                <CopyField value={conversation.shareUrl} />
            </CollapsibleSection>
        </div>
    )
}
