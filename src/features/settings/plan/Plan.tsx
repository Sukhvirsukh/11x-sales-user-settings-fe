import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import DetailContainer, { DetailGroup, DetailItem } from "@/components/design/DetailContainer";
import Heading from "@/components/design/Heading";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import styles from "./Plan.module.css";
import { cn, dateFormater } from "@/lib/utils";
import { planQueryKey, usePlanQuery } from "./planQuery";
import type { Plan as PlanData } from "./planTypes";
import { upgradePlan } from "./planApi";

interface PlanCardProps {
    plan: PlanData;
    isCurrent: boolean;
    isUpgradePending: boolean;
    isUpgrading: boolean;
    onUpgrade: (planId: string) => void;
}

const EMPTY_PLANS: PlanData[] = [];

function PlanCard({ plan, isCurrent, isUpgradePending, isUpgrading, onUpgrade }: PlanCardProps) {
    const { name, features, isMostPopular, priceInr } = plan;

    return (
        <article
            className={cn(
                styles.card,
                "flex min-w-0 flex-col",
                isMostPopular
                    ? "relative z-10 rounded-[10px] bg-white shadow-[0_0_18px_4px_rgba(53,118,243,0.25)]"
                    : "py-0.5"
            )}
        >
            <div
                className={cn(
                    "flex min-h-15 items-center justify-between px-5 py-2.5",
                    isMostPopular
                        ? "border-b rounded-t-[9px] border-transparent bg-table-header px-5"
                        : "mx-5 border-b border-border px-0"
                )}
            >
                <div className="min-w-0">
                    <h3 className={cn("text-sm font-normal", isMostPopular ? "text-black" : "text-ghost")}>
                        {name}
                    </h3>
                    <p className="mt-1 text-lg font-medium text-black">Starting at INR {priceInr}</p>
                </div>
                {isMostPopular && (
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
                        variant={isMostPopular ? "primary" : "secondary"}
                        className="min-h-9 w-full whitespace-normal"
                        disabled={isCurrent || isUpgradePending}
                        onClick={() => onUpgrade(plan.id)}
                    >
                        {isCurrent ? "Current plan" : isUpgrading ? "Upgrading..." : isMostPopular ? (
                            <span>Upgrade today and get <strong>10% OFF</strong></span>
                        ) : "Upgrade"}
                    </Button>
                </div>
            </div>
        </article>
    );
}

export function Plan() {

    const { data, isLoading, error } = usePlanQuery();
    const queryClient = useQueryClient();
    const upgradeMutation = useMutation({
        mutationFn: upgradePlan,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: planQueryKey });
        },
    });
    const plans = data?.plans ?? EMPTY_PLANS;
    const currentSubscription = data?.currentSubscription;
    const currentPlanId = data?.currentSubscription?.planId;

    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const carousel = carouselRef.current;
        const popularIndex = plans.findIndex((plan) => plan.isMostPopular);
        if (!carousel || popularIndex < 0 || window.matchMedia("(min-width: 1024px)").matches) return;
        const card = carousel.children[popularIndex] as HTMLElement | undefined;
        if (card) carousel.scrollLeft = card.offsetLeft - (carousel.clientWidth - card.clientWidth) / 2;
    }, [plans]);

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

    const calculateEndDate = useMemo(() => {
        if (!currentSubscription) return null;

        if (currentSubscription.currentPeriodEnd) {
            return new Date(currentSubscription.currentPeriodEnd);
        }

        const startDate = new Date(currentSubscription.currentPeriodStart);
        const endDate = new Date(currentSubscription.currentPeriodStart);
        endDate.setMonth(startDate.getMonth() + 1);
        return endDate;
    }, [currentSubscription?.currentPeriodEnd, currentSubscription?.currentPeriodStart]);

    if (isLoading) return <Loader />

    if (error) {
        return <p className="text-sm text-danger">Unable to load plans. Please try again.</p>;
    }

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
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isCurrent={plan.id === currentPlanId}
                                isUpgradePending={upgradeMutation.isPending}
                                isUpgrading={upgradeMutation.isPending && upgradeMutation.variables === plan.id}
                                onUpgrade={upgradeMutation.mutate}
                            />
                        ))
                    }
                </div>
            </AppSection>

            {currentSubscription && <AppSection
                className="w-full"
            >
                <Heading size="lg">Other details</Heading>
                <AppCard>
                    <DetailContainer fullWidth={true} equalWidth={true}>
                        <DetailGroup>
                            <DetailItem label="Start date" value={dateFormater(currentSubscription?.currentPeriodStart, 'long')} />
                        </DetailGroup>
                        <DetailGroup>
                            <DetailItem label="End date" value={dateFormater(calculateEndDate, 'long')} />
                        </DetailGroup>
                        <DetailGroup>
                            <DetailItem label="Plan" value={currentSubscription?.plan?.name || 'Basic'} />
                        </DetailGroup>
                        <DetailGroup>
                            <DetailItem label="Point used" value="127/990" />
                        </DetailGroup>
                        <DetailGroup>
                            <DetailItem label="Next cycle" value={dateFormater(calculateEndDate, 'long')} />
                        </DetailGroup>
                    </DetailContainer>
                </AppCard>
            </AppSection>}
        </>
    )
}
