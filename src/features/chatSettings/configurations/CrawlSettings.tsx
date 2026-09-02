import { useState } from "react";
import { MultiTextField } from "@/components/design/MultiTextField";
import Heading from "@/components/design/Heading";
import AppCard from "@/components/design/AppCard";
import Label from "@/components/design/Label";
import HelperText from "@/components/design/HelperText";
import SectionHeader from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { configFieldContainerClassName } from "./fieldStyles";

const STOCK_OPTIONS = [
    { label: "Out of stock only", value: "out-of-stock" },
    { label: "Discontinued", value: "discontinued" },
] as const;

const DEFAULT_IGNORE_ELEMENTS = ["Footer", "miniature", "keychain"];

export default function CrawlSettings() {
    const [stockFilter, setStockFilter] = useState<string | null>(null);
    const [ignoreElements, setIgnoreElements] = useState<string[]>(
        DEFAULT_IGNORE_ELEMENTS
    );

    return (
        <SectionHeader heading="Crawl settings">
            <AppCard>
                <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[1fr_315px] lg:gap-10">
                    <div className="flex min-w-0 flex-col gap-5 lg:border-r lg:border-border-light lg:pr-5">
                        <div className="flex w-full flex-col gap-1.5">
                            <Label htmlFor="stock-products">
                                Select stock products to ignore out of crawling
                            </Label>

                            <Select
                                value={stockFilter}
                                onValueChange={setStockFilter}
                            >
                                <SelectTrigger
                                    id="stock-products"
                                    className={cn(
                                        "w-full rounded-[10px] px-3.5 text-base text-foreground focus-visible:ring-2 focus-visible:ring-blue-400/20 data-placeholder:text-muted-foreground",
                                        configFieldContainerClassName
                                    )}
                                >
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="rounded-[10px] border-border-soft bg-white">
                                    {STOCK_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <HelperText>
                                Vitlab will not take into consideration of any
                                products that are out of stocks
                            </HelperText>
                        </div>

                        <MultiTextField
                            label="Add or remove your Ignore elements from the pages when crawling"
                            hint="Type to add elements, cross to remove elements that are irrelevant to the main content of a page like Headers, Footer, Cross-sell product links, etc"
                            value={ignoreElements}
                            onValueChange={setIgnoreElements}
                            containerClassName={cn(
                                configFieldContainerClassName,
                                "h-auto min-h-[90px] items-start"
                            )}
                        />
                    </div>

                    <aside className="flex min-w-0 flex-col gap-4 rounded-[10px] bg-muted p-2.5 text-muted-foreground md:p-4">
                        <Heading size="md" as="h3" className="leading-relaxed">
                            We use CSS selectors to identify elements, use the
                            following syntax:
                        </Heading>

                        <ul className="space-y-4 text-sm leading-relaxed">
                            <li className="flex items-start gap-2.5">
                                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-ghost" />
                                <div>
                                    For tags, just use the name of the tag:
                                    <br />
                                    <span className="text-muted-foreground">
                                        e.g.: header
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-ghost" />
                                <div>
                                    For IDs, use brackets: e.g.
                                    <br />
                                    <code className="rounded bg-border-light px-1 py-0.5 text-sm text-foreground">
                                        [id*=&quot;id-name&quot;]
                                    </code>
                                </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-ghost" />
                                <div>
                                    For classes, use brackets: e.g.
                                    <br />
                                    <code className="rounded bg-border-light px-1 py-0.5 text-sm text-foreground">
                                        [class*=&quot;class-name&quot;]
                                    </code>
                                </div>
                            </li>
                        </ul>
                    </aside>
                </div>
            </AppCard>
        </SectionHeader>
    );
}
