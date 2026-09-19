import { useRef } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";

const videos = [
    { title: "The best thing you can do for your store" },
    { title: "Ai can take all the responsibility" },
    { title: "Make every customer conversation count" },
];

export default function KnowMore() {
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
        <AppSection>
            <div className="w-full flex items-center justify-between">
                <Heading>Know more</Heading>
                <Button size="sm" variant="underline-bare">Show all</Button>
            </div>
            <div className="w-full relative">
                <div
                    ref={carouselRef}
                    className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {videos.map((video) => (
                        <article key={video.title} className="w-[65%] shrink-0 snap-start">
                            <div className="flex aspect-[1.75] items-center justify-center rounded-[6px] bg-content-muted">
                                <button
                                    type="button"
                                    aria-label={`Watch ${video.title}`}
                                    className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-border transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-primary"
                                >
                                    <Play className="ml-0.5 size-4 fill-background text-background" />
                                </button>
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm leading-4 text-foreground">{video.title}</p>
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
        </AppSection>
    )
}
