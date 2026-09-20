import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { OverviewTip } from "../overviewType";

interface TipsProps {
    /** `tips` section of the Overview response. */
    tips?: OverviewTip[];
    /** True while the Overview request is in flight. */
    isLoading?: boolean;
}

export default function Tips({ tips, isLoading = false }: TipsProps) {
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

    return (
        <AppSection>
            <div className="w-full flex items-center justify-between">
                <Heading>Tips</Heading>
                <Button size="sm" variant="underline-bare">Show all</Button>
            </div>
            <div className="w-full flex flex-col">
                {tips.map(({ title, href }) => (
                    <Link
                        key={title}
                        to={href}
                        className="flex items-center cursor-pointer justify-between gap-3 py-1.5 text-left text-base text-foreground transition-colors hover:text-primary"
                    >
                        <span>{title}</span>
                        <ChevronRight className="size-4 shrink-0 text-content-muted" aria-hidden />
                    </Link>
                ))}
            </div>
        </AppSection>
    )
}
