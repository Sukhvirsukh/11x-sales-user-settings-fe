import { useRef } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import type { KnowMoreItem } from "../overviewType";

function Carousel({ items }: { items: KnowMoreItem[] }) {
    const carouselRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "previous" | "next") => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        carousel.scrollBy({
            left: (direction === "next" ? 1 : -1) * carousel.clientWidth * 0.8,
            behavior: "smooth",
        });
    };

    return (
        <>
            <div className="w-full flex items-center justify-between">
                <Heading>Know more</Heading>
                <Button
                    size="sm"
                    variant="underline-bare"
                    onClick={() => window.open('https://www.youtube.com/watch?v=mWRMjEIh4hE&list=PLJ_2mz_M8S6s', "_blank")}
                >Show all</Button>
            </div>
            <div className="w-full relative">
                <div
                    ref={carouselRef}
                    className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {items.map((item) => (
                        <article key={item.title} className="w-[65%] shrink-0 snap-start">
                            <div className="flex aspect-[1.75] items-center justify-center rounded-md bg-[#cccc]">
                                {item.type === "video" && (
                                    <button
                                        type="button"
                                        aria-label={`Watch ${item.title}`}
                                        className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-border transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-primary"
                                        onClick={() => window.open('https://www.youtube.com/watch?v=mWRMjEIh4hE&list=PLJ_2mz_M8S6s', "_blank")}
                                    >
                                        <Play className="ml-0.5 size-4 fill-background text-background" />
                                    </button>
                                )}
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm leading-4 text-foreground">{item.title}</p>
                        </article>
                    ))}
                </div>

                <Button
                    type="button"
                    variant="bare"
                    size="icon"
                    aria-label="Previous videos"
                    onClick={() => scroll("previous")}
                    className="absolute left-4 top-[34px] size-8 -translate-x-1/2 rounded-full bg-background p-0 shadow-panel hover:bg-surface-subtle"
                >
                    <ChevronLeft className="size-4 text-content-muted" />
                </Button>
                <Button
                    type="button"
                    variant="bare"
                    size="icon"
                    aria-label="Next videos"
                    onClick={() => scroll("next")}
                    className="absolute right-4 top-[34px] size-8 translate-x-1/2 rounded-full bg-background p-0 shadow-panel hover:bg-surface-subtle"
                >
                    <ChevronRight className="size-4 text-content-muted" />
                </Button>
            </div>
        </>
    )
}

interface KnowMoreProps {
    /** `knowMore` section of the Overview response. */
    items?: KnowMoreItem[];
    /** True while the Overview request is in flight. */
    isLoading?: boolean;
}

export default function KnowMore({ items, isLoading = false }: KnowMoreProps) {
    if (isLoading) {
        return (
            <AppSection>
                <Skeleton className="h-44 w-full" />
            </AppSection>
        );
    }

    if (!items || items.length === 0) {
        return (
            <AppSection>
                <p className="flex h-44 w-full items-center justify-center text-sm text-content-muted">
                    Nothing to show yet.
                </p>
            </AppSection>
        );
    }

    return (
        <AppSection>
            <Carousel items={items} />
        </AppSection>
    )
}
