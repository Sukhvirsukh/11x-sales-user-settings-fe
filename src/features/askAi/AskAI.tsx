import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import PreviewSection from "@/components/design/PreviewSection";
import { Separator } from "@/components/ui/separator";
import AskAIChat from "./AskAIChat";

export function AskAI() {
    return (
        <PreviewSection>
            <div className="flex w-full flex-col gap-3.5 md:flex-row">
                <AppSection className="h-[80vh] min-w-0 flex-1 justify-between md:py-7.5 md:px-5">
                    <AskAIChat />
                </AppSection>
                <div className="flex w-full flex-col gap-3.5 md:w-auto md:flex-row md:self-start">
                    <Separator className="md:hidden" />
                    <Separator orientation="vertical" className="hidden md:block" />
                    <aside className="w-full shrink-0 md:w-[230px]">
                        <Heading size="md" className="mb-4 font-semibold">History</Heading>
                        <div className="flex flex-col gap-[30px]">
                            <div>
                                <p className="text-sm text-gray">Today</p>
                                <ul className="my-1 space-y-1 text-base">
                                    <li className="my-2">Integrate shopify with vitalb..</li>
                                    <li className="my-2">How to add shopify</li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm text-gray">Yesterday</p>
                                <ul className="my-1 space-y-1 text-base">
                                    <li className="my-2">Integrate shopify with vitalb..</li>
                                    <li className="my-2">How to add shopify</li>
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </PreviewSection>
    )
}
