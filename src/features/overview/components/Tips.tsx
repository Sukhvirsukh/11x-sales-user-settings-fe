import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { useId, useState } from "react";

import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { OverviewTip } from "../overviewType";

const INITIAL_TIPS_COUNT = 2;

interface TipsProps {
    /** `tips` section of the Overview response. */
    tips?: OverviewTip[];
    /** True while the Overview request is in flight. */
    isLoading?: boolean;
}

function TipLink({ title, href }: OverviewTip) {
    return (
        <Link
            to={href}
            className="flex items-center cursor-pointer justify-between gap-3 py-1.5 text-left text-base text-foreground transition-colors hover:text-primary"
        >
            <span>{title}</span>
            <ChevronRight className="size-4 shrink-0 text-content-muted" aria-hidden />
        </Link>
    );
}

export default function Tips({ tips, isLoading = false }: TipsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const tipsListId = useId();

    if (isLoading) {
        return (
            <AppSection>
                <Skeleton className="h-40 w-full" />
            </AppSection>
        );
    }

    if (!tips || tips.length === 0) {
        return (
            <AppSection>
                <p className="flex h-40 w-full items-center justify-center text-sm text-content-muted">
                    No tips right now.
                </p>
            </AppSection>
        );
    }

    const hasMoreTips = tips.length > INITIAL_TIPS_COUNT;
    const initialTips = tips.slice(0, INITIAL_TIPS_COUNT);
    const additionalTips = tips.slice(INITIAL_TIPS_COUNT);

    return (
        <AppSection className="gap-2.5">
            <div className="w-full flex items-center justify-between">
                <Heading>Tips</Heading>
                {hasMoreTips && (
                    <Button
                        type="button"
                        size="sm"
                        variant="underline-bare"
                        aria-controls={tipsListId}
                        aria-expanded={isExpanded}
                        onClick={() => setIsExpanded((expanded) => !expanded)}
                    >
                        {isExpanded ? "Show less" : "Show all"}
                    </Button>
                )}
            </div>
            <div id={tipsListId} className="w-full flex flex-col">
                {initialTips.map((tip) => (
                    <TipLink key={`${tip.href}-${tip.title}`} {...tip} />
                ))}
                {hasMoreTips && (
                    <div
                        className={cn(
                            "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none",
                            isExpanded
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0",
                        )}
                    >
                        <div className="min-h-0 overflow-hidden">
                            <div
                                className="flex flex-col"
                                aria-hidden={!isExpanded}
                                inert={!isExpanded}
                            >
                                {additionalTips.map((tip) => (
                                    <TipLink key={`${tip.href}-${tip.title}`} {...tip} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppSection>
    )
}
