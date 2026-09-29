import { Fragment } from "react"
import { ChevronRight } from "lucide-react"
import Heading from "@/components/design/Heading"
import { SelectField } from "@/components/design/SelectField"
import CopyField from "@/components/shared/CopyField"
import { noop } from "@/lib/utils"
import AddNote from "./AddNote"
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

            <div className="border-t border-section-border pt-4">
                <div className="flex w-full items-center justify-between gap-2 text-left">
                    <Heading size="md" className="font-semibold">Customer details</Heading>
                    <ChevronRight aria-hidden className="hidden size-4 shrink-0 text-content-muted lg:block" />
                </div>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                    {details.map((detail) => (
                        <Fragment key={detail.label}>
                            <dt className="text-content-muted">{detail.label}</dt>
                            <dd className="truncate text-foreground">{detail.value}</dd>
                        </Fragment>
                    ))}
                </dl>
            </div>

            <div className="border-t border-section-border pt-4">
                <div className="mb-2.5 flex w-full items-center justify-between gap-2 text-left">
                    <Heading size="md" className="font-semibold">Share URL</Heading>
                    <ChevronRight aria-hidden className="hidden size-4 shrink-0 text-content-muted lg:block" />
                </div>
                <CopyField value={conversation.shareUrl} />
            </div>
        </div>
    )
}
