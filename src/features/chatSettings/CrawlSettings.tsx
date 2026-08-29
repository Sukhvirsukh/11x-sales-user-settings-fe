import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import CustomSection from "./CustomSection";

export default function CrawlSettings() {
    const [tags, setTags] = useState<string[]>(["Footer", "miniature", "keychain"]);
    const [tagInput, setTagInput] = useState("");

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    return (
        <CustomSection heading="Crawl Settings">
            {/* Changed items-stretch (default grid behavior) to ensure equal heights */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                {/* Left Column (Inputs) */}
                <div className="flex flex-col justify-between space-y-6 lg:col-span-2 lg:border-r lg:border-border lg:pr-4">

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
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-foreground">
                            Add or remove your Ignore elements from the pages when crawling
                        </label>
                        <div className="min-h-[110px] p-2 bg-card border border-border rounded-md focus-within:ring-2 focus-within:ring-ring/40 flex flex-wrap gap-2 content-start">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1.5 bg-muted/80 border border-border text-muted-foreground text-xs px-2.5 py-1 rounded-md"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="text-placeholder hover:text-foreground/80"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
                                className="flex-1 min-w-[120px] bg-transparent outline-none text-xs text-foreground py-1"
                            />
                        </div>
                        <p className="text-micro text-placeholder leading-relaxed">
                            Type to add elements, cross to remove elements that that are irrelrvant to the main content of a page like Headers, Footer, Cross-sell product links, etc
                        </p>
                    </div>

                </div>

                {/* Right Column - Added `h-full` to stretch container height */}
                <div className="flex h-full flex-col justify-start space-y-4 rounded-xl border border-border/50 bg-surface-help p-4 text-muted-foreground sm:p-6">
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