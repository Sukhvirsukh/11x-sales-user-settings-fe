import AppSection from "@/components/design/AppSectoin";
import { Banner } from "@/components/design/Banner";
import PreviewSection from "@/components/design/PreviewSection";
import AskAIChat from "./AskAIChat";

export function AskAI() {
    return (
        <PreviewSection>
            <div className="flex w-full flex-col gap-3 md:flex-row">
                <AppSection className="h-[80vh] min-w-0 flex-1 justify-between md:py-7.5 md:px-5">
                    <AskAIChat />
                </AppSection>
                <Banner
                    variant="info"
                    title="History"
                    titleClassName="text-[16px] font-semibold mb-4"
                    className="h-fit w-full shrink-0 self-start md:w-[230px]"

                >
                    <div className="flex flex-col gap-[30px]">
                        <div className="">
                            <p className="text-sm text-gray">
                                Today
                            </p>
                            <ul className="space-y-1 text-base my-1">
                                <li className="my-2">
                                    Integrate shopify with vitalb..
                                </li>
                                <li className="my-2">
                                    How to add shopify
                                </li>
                            </ul>
                        </div>
                        <div className="">
                            <p className="text-sm text-gray">
                                Yesterday
                            </p>
                            <ul className="space-y-1 text-base my-1">
                                <li className="my-2">
                                    Integrate shopify with vitalb..
                                </li>
                                <li className="my-2">
                                    How to add shopify
                                </li>
                            </ul>
                        </div>
                    </div>
                </Banner>
            </div>
        </PreviewSection>
    )
}
