import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import DetailContainer, { DetailGroup, DetailItem } from "@/components/design/DetailContainer";
import Heading from "@/components/design/Heading";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import styles from "./Plan.module.css";
import { cn } from "@/lib/utils";

interface PlanDetails {
    label: string;
    features: string[];
    isPopular: boolean;
    isCurrent?: boolean;
    startingPrice?: string;
}

const plans: PlanDetails[] = [
    { label: "Basic Plan", features: ['1 Chatbot', '1 User', '1,000 Message credits/month', 'Standard support'], isPopular: false, isCurrent: true, startingPrice: "INR 000" },
    { label: "Pro Plan", features: ['5 Chatbots', '10 Users', '10,000 Message credits/month', 'Priority support'], isPopular: true, startingPrice: "INR 450" },
    { label: "Professional Plan", features: ['Unlimited Chatbots', 'Unlimited Users', 'Unlimited Message credits/month', 'Priority support'], isPopular: false, startingPrice: "INR 650" },
];

function PlanCard({ label, features, isPopular, isCurrent, startingPrice }: PlanDetails) {
    return (
        <article
            className={cn(
                styles.card,
                "flex min-w-0 flex-col",
                isPopular
                    ? "relative z-10 rounded-[10px] bg-white shadow-[0_0_18px_4px_rgba(53,118,243,0.25)]"
                    : "py-0.5"
            )}
        >
            <div
                className={cn(
                    "flex min-h-15 items-center justify-between px-5 py-2.5",
                    isPopular
                        ? "border-b rounded-t-[9px] border-transparent bg-table-header px-5"
                        : "mx-5 border-b border-border px-0"
                )}
            >
                <div className="min-w-0">
                    <h3 className={cn("text-sm font-normal", isPopular ? "text-black" : "text-ghost")}>
                        {label}
                    </h3>
                    {startingPrice && (
                        <p className="mt-1 text-lg font-medium text-black">Starting at {startingPrice}</p>
                    )}
                </div>
                {isPopular && (
                    <Badge indigator={false} className="rounded-full bg-[#F5FFBB] text-black">
                        Most popular
                    </Badge>
                )}
            </div>
            <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                <ul className="flex flex-col gap-4">
                    {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-base text-[#4D4D4D]">
                            <Check aria-hidden="true" className="size-4 shrink-0 text-ghost" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-auto pt-8">
                    <Button
                        variant={isPopular ? "primary" : "secondary"}
                        className="min-h-9 w-full whitespace-normal"
                        disabled={isCurrent}
                    >
                        {isCurrent ? "Current plan" : isPopular ? (
                            <span>Upgrade today and get <strong>10% OFF</strong></span>
                        ) : "Upgrade"}
                    </Button>
                </div>
            </div>
        </article>
    );
}

export function Plan() {
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const carousel = carouselRef.current;
        const popularIndex = plans.findIndex((plan) => plan.isPopular);
        if (!carousel || popularIndex < 0 || window.matchMedia("(min-width: 1024px)").matches) return;
        const card = carousel.children[popularIndex] as HTMLElement;
        carousel.scrollLeft = card.offsetLeft - (carousel.clientWidth - card.clientWidth) / 2;
    }, []);

    const showPlan = (direction: -1 | 1) => {
        const carousel = carouselRef.current;
        if (!carousel) return;
        const cards = Array.from(carousel.children) as HTMLElement[];
        if (!cards.length) return;
        const center = carousel.scrollLeft + carousel.clientWidth / 2;
        const currentIndex = cards.reduce((closest, card, index) =>
            Math.abs(card.offsetLeft + card.clientWidth / 2 - center) <
                Math.abs(cards[closest].offsetLeft + cards[closest].clientWidth / 2 - center) ? index : closest, 0);
        const next = cards[(currentIndex + direction + cards.length) % cards.length];
        carousel.scrollTo({
            left: next.offsetLeft - (carousel.clientWidth - next.clientWidth) / 2,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        });
    };

    return (
        <>
            <AppSection className="w-full min-w-0 gap-0! overflow-hidden">
                <div className="flex w-full items-center justify-between">
                    <Heading size="lg">Plan</Heading>
                    <div className="flex items-center gap-2 lg:hidden">
                        <Button variant="secondary" size="sm" className="size-6 rounded-md bg-white p-0!" aria-label="Show previous plan" onClick={() => showPlan(-1)}>
                            <ChevronLeft aria-hidden="true" className="size-3.5" />
                        </Button>
                        <Button variant="secondary" size="sm" className="size-6 rounded-md bg-white p-0!" aria-label="Show next plan" onClick={() => showPlan(1)}>
                            <ChevronRight aria-hidden="true" className="size-3.5" />
                        </Button>
                    </div>
                </div>

                <div ref={carouselRef} className={styles.carousel} role="region" aria-label="Available plans" tabIndex={0}>
                    {
                        plans.map((plan) => (
                            <PlanCard key={plan.label} {...plan} />
                        ))
                    }
                </div>
            </AppSection>

            <AppSection
                className="w-full"
            >
                <Heading size="lg">Other details</Heading>
                <AppCard>
                    <DetailContainer fullWidth={true} equalWidth={true}>
                        <DetailGroup>
                            <DetailItem label="Start date" value="12th May 2026" />
                        </DetailGroup>
                        <DetailGroup>
                            <DetailItem label="End date" value="12th June 2026" />
                        </DetailGroup>
                        <DetailGroup>
                            <DetailItem label="Plan" value="Basic" />
                        </DetailGroup>
                        <DetailGroup>
                            <DetailItem label="Point used" value="127/990" />
                        </DetailGroup>
                        <DetailGroup>
                            <DetailItem label="Next cycle" value="12th June 2026" />
                        </DetailGroup>
                    </DetailContainer>
                </AppCard>
            </AppSection>
        </>
    )
}
