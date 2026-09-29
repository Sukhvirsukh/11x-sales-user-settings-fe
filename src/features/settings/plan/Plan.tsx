import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCan } from "@/features/auth";
import { planQueryKey, usePlanQuery } from "./planQuery";
import type { Plan as PlanData } from "./planTypes";
import { upgradePlan } from "./planApi";

interface PlanCardProps {
    plan: PlanData;
    isCurrent: boolean;
    canUpgrade: boolean;
    isUpgradePending: boolean;
    isUpgrading: boolean;
    onUpgrade: () => void;
    hasMoreThanThreePlans: boolean;
    isActive: boolean;
}

const EMPTY_PLANS: PlanData[] = [];

function getActiveCardIndex(carousel: HTMLDivElement) {
    const cards = Array.from(carousel.children) as HTMLElement[];
    const center = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;

    return cards.reduce((closest, card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left + card.clientWidth / 2 - center);
        const closestCard = cards[closest];
        const closestDistance = Math.abs(closestCard.getBoundingClientRect().left + closestCard.clientWidth / 2 - center);
        return distance < closestDistance ? index : closest;
    }, 0);
}

function PlanCard({ plan, isCurrent, canUpgrade, isUpgradePending, isUpgrading, onUpgrade, hasMoreThanThreePlans, isActive }: PlanCardProps) {
    const { name, features, isMostPopular, priceInr } = plan;

    return (
        <article className={`flex min-w-62.5 shrink-0 basis-[85%] snap-center flex-col rounded-[10px] border border-primary/20 transition-[transform,box-shadow] duration-200 motion-reduce:transition-none lg:min-w-0 ${hasMoreThanThreePlans ? "lg:basis-[calc((100%_-_0.5rem)/3)]" : "lg:flex-1"} ${isActive ? `relative z-10 shadow-plan-selected ${hasMoreThanThreePlans ? "" : "lg:translate-y-0 lg:shadow-none"}` : ""} ${isMostPopular ? 'pt-0' : 'pt-2.5'}`}>
            {
                isMostPopular && (
                    <p className="bg-gold py-1.25 px-2.5 text-xs font-bold text-center rounded-t-[10px]">
                        Most Popular | 10k subscribers
                    </p>
                )
            }
            <div className="p-2.5 pt-1.5 border-b border-primary/20">
                <Heading size="sm" className="font-bold mb-1">
                    {
                        name
                    }
                </Heading>
                <p className="text-sm">
                    Starting at INR {priceInr}
                </p>
            </div>
            <div className={`flex flex-1 flex-col ${isMostPopular ? 'bg-white' : 'bg-transparent'} pb-2.5 rounded-b-[10px]`}>
                <ul className={`p-2.5`}>
                    {
                        features.map((feature) => (
                            <li key={feature} className="flex gap-2 py-1.25">
                                <Check className="size-4 shrink-0 text-content-muted" />
                                <p className="text-sm text-content-muted">
                                    {
                                        feature
                                    }
                                </p>
                            </li>
                        ))
                    }
                </ul>
                <div className="mt-auto p-2.5">
                    <Button
                        variant={isMostPopular ? "primary" : "ghost"}
                        size="sm"
                        className="w-full"

                        onClick={onUpgrade}
                        disabled={!canUpgrade || isUpgradePending || isUpgrading || isCurrent}
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

    const carouselRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { data, isLoading, error } = usePlanQuery();
    const canUpgradePlan = useCan("settings.plan.create");
    const queryClient = useQueryClient();
    const upgradeMutation = useMutation({
        mutationFn: (planId: string) => {
            if (!canUpgradePlan) {
                return Promise.reject(new Error("You do not have permission to upgrade the plan."));
            }
            return upgradePlan(planId);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: planQueryKey });
        },
    });
    const plans = data?.plans ?? EMPTY_PLANS;
    const currentPlanId = data?.currentSubscription?.planId;
    const hasMoreThanThreePlans = plans.length > 3;

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel || !plans.length) return;

        const syncActivePlan = () => setActiveIndex(getActiveCardIndex(carousel));
        const observer = new ResizeObserver(syncActivePlan);
        observer.observe(carousel);
        syncActivePlan();
        return () => observer.disconnect();
    }, [plans.length]);

    function updateActivePlan() {
        const carousel = carouselRef.current;
        if (carousel && plans.length) setActiveIndex(getActiveCardIndex(carousel));
    }

    function scrollCards(direction: -1 | 1) {
        const carousel = carouselRef.current;
        const firstCard = carousel?.firstElementChild;
        if (!carousel || !(firstCard instanceof HTMLElement)) return;

        const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 0;
        carousel.scrollBy({
            left: direction * (firstCard.getBoundingClientRect().width + gap),
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        });
    }

    if (isLoading) return <Loader />

    if (error) {
        return <p className="text-sm text-danger">Unable to load plans. Please try again.</p>;
    }

    return (
        <AppSection className="overflow-hidden">
            <Heading size="lg">Plans</Heading>
            <div className="relative w-full min-w-0">
                <div ref={carouselRef} onScroll={updateActivePlan} className="flex w-full min-w-0 snap-x snap-mandatory gap-1 overflow-x-auto scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="region" aria-label="Available plans" tabIndex={0}>
                    {plans.map((plan, index) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            isCurrent={plan.id === currentPlanId}
                            canUpgrade={canUpgradePlan}
                            isUpgradePending={upgradeMutation.isPending}
                            isUpgrading={upgradeMutation.isPending && upgradeMutation.variables === plan.id}
                            onUpgrade={() => upgradeMutation.mutate(plan.id)}
                            hasMoreThanThreePlans={hasMoreThanThreePlans}
                            isActive={index === activeIndex}
                        />
                    ))}
                </div>
                <Button
                    variant="secondary"
                    size="icon"
                    className={`absolute top-1/2 left-2 z-10 size-8 -translate-y-1/2 border border-black/10 rounded-full bg-white p-0 ${hasMoreThanThreePlans ? "" : "lg:hidden"}`}
                    aria-label="Previous plan"
                    disabled={plans.length < 2}
                    onClick={() => scrollCards(-1)}
                >
                    <ChevronLeft aria-hidden="true" className="size-3" />
                </Button>
                <Button
                    variant="secondary"
                    size="icon"
                    className={`absolute top-1/2 right-2 z-10 size-8 border border-black/10  -translate-y-1/2 rounded-full bg-white p-0 ${hasMoreThanThreePlans ? "" : "lg:hidden"}`}
                    aria-label="Next plan"
                    disabled={plans.length < 2}
                    onClick={() => scrollCards(1)}
                >
                    <ChevronRight aria-hidden="true" className="size-3" />
                </Button>
            </div>
        </AppSection>
    );
}
