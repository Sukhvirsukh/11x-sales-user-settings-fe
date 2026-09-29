import { ChevronRight } from "lucide-react"
import Heading from "@/components/design/Heading"
import { SelectField } from "@/components/design/SelectField"
import { noop } from "@/lib/utils"
import AddNote from "./AddNote"
import { type Conversation } from "./conversationData"
import ShareUrlField from "./ShareUrlField"

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
                <dl className="mt-3 grid grid-cols-4 gap-x-2 gap-y-2 text-[10px] lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-x-3 lg:text-sm">
                    {details.map((detail) => (
                        <div key={detail.label} className="min-w-0 lg:contents">
                            <dt className="font-normal text-content-muted">{detail.label}</dt>
                            <dd className="mt-1 break-words font-medium text-foreground lg:mt-0 lg:font-normal">{detail.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            <div className="hidden lg:block border-t border-section-border pt-4">
                <ShareUrlField url={conversation.shareUrl} />
            </div>
        </div>
    )
}
