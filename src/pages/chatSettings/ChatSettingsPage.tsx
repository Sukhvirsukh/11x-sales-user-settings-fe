import { PageHeader } from "@/components/shared/PageHeader";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import Channels from "@/features/chatSettings/Channels";
import Configurations from "@/features/chatSettings/configurations/Configurations";
import Integrations from "@/features/chatSettings/Integrations";

export default function ChatSettingsPage() {
    return (
        <section className="h-full min-w-0">
            <PageHeader
                title="Chat settings"
                subtitle="Customize how your AI interact with your customer"
            >
                <div className="relative min-w-0 rounded-[10px] border border-blue-100/70 px-2.5 shadow-blue md:px-4">
                    <Accordion defaultValue={["channels"]}>
                        <AccordionItem value="channels">
                            <AccordionTrigger>Channels</AccordionTrigger>
                            <AccordionContent>
                                <Channels />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="integration">
                            <AccordionTrigger>Integration</AccordionTrigger>
                            <AccordionContent>
                                <Integrations />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="configurations">
                            <AccordionTrigger>Configurations</AccordionTrigger>
                            <AccordionContent>
                                <Configurations />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </PageHeader>
        </section>
    )
}
