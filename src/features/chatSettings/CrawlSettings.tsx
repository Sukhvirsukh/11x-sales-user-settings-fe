import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CustomMultiTextField } from "@/components/custom";
import CustomSection from "./CustomSection";

export default function CrawlSettings() {
    const [tags, setTags] = useState<string[]>(["Footer", "miniature", "keychain"]);

    return (
        <CustomSection heading="Crawl Settings">
            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">

                {/* Left Column (Inputs) */}
                <div className="flex min-w-0 flex-col justify-between space-y-6 lg:col-span-2 lg:border-r lg:border-border lg:pr-4">

                    {/* Select Stock Products */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-foreground">
                            Select stock products to ignore out of crawling
                        </label>
                        <div className="relative">
                            <select className="w-full h-10 px-3 pr-8 appearance-none bg-card border border-border rounded-md text-placeholder focus:outline-none focus:ring-2 focus:ring-ring/40 text-xs cursor-pointer">
                                <option value="">Select</option>
                                <option value="out-of-stock">Out of stock only</option>
                                <option value="discontinued">Discontinued</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-placeholder pointer-events-none" />
                        </div>
                        <p className="text-micro text-placeholder">
                            Vitlab will not take into consideration of any products that are out of stocks
                        </p>
                    </div>

                    {/* Tag / Ignore Elements Input */}
                    <CustomMultiTextField
                        label="Add or remove your Ignore elements from the pages when crawling"
                        hint="Type to add elements, cross to remove elements that are irrelevant to the main content of a page like Headers, Footer, Cross-sell product links, etc"
                        value={tags}
                        onValueChange={setTags}
                    />

                </div>

                {/* Right Column - Added `h-full` to stretch container height */}
                <div className="flex min-w-0 flex-col justify-start space-y-4 rounded-xl border border-border/50 bg-surface-help p-3 text-muted-foreground sm:p-6">
                    <h3 className="font-semibold text-foreground text-xs leading-relaxed">
                        We use CSS selectors to identify elements, use the following syntax:
                    </h3>
                    <ul className="space-y-4 text-xs leading-relaxed pt-1">
                        <li className="flex items-start gap-2.5">
                            <span className="h-2 w-2 rounded-full bg-placeholder mt-1 shrink-0" />
                            <div>
                                For tags, just use the name of the tag: <br />
                                <span className="text-muted-foreground">e.g.:header</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <span className="h-2 w-2 rounded-full bg-placeholder mt-1 shrink-0" />
                            <div>
                                For IDs, use brackets: e.g.<br />
                                <code className="text-foreground/80 bg-border/60 px-1 py-0.5 rounded text-micro">
                                    [id*=&quot;id-name&quot;]
                                </code>
                            </div>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <span className="h-2 w-2 rounded-full bg-placeholder mt-1 shrink-0" />
                            <div>
                                For classes, use brackets: e.g.<br />
                                <code className="text-foreground/80 bg-border/60 px-1 py-0.5 rounded text-micro">
                                    [class*=&quot;class-name&quot;]
                                </code>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </CustomSection>
    );
}
