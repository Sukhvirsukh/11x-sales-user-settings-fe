import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import DetailContainer, { DetailGroup, DetailItem } from "@/components/design/DetailContainer";
import Heading from "@/components/design/Heading";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useCan } from "@/features/auth";
import styles from "./Plan.module.css";
import { cn, dateFormater } from "@/lib/utils";
import { planQueryKey, usePlanQuery } from "./planQuery";
import type { Plan as PlanData, PlanResponse } from "./planTypes";
import { WEBSITE } from "@/config/website";
import { openBillingPortal, upgradePlan } from "./planApi";

const STATUS_LABEL: Record<string, string> = {
    active: "Active",
    trialing: "Trial",
    past_due: "Payment due",
    canceled: "Cancelled",
};

interface PlanCardProps {
    plan: PlanData;
    isCurrent: boolean;
    canUpgrade: boolean;
    isUpgradePending: boolean;
    isUpgrading: boolean;
    onUpgrade: (planId: string) => void;
}

const EMPTY_PLANS: PlanData[] = [];

function PlanCard({ plan, isCurrent, canUpgrade, isUpgradePending, isUpgrading, onUpgrade }: PlanCardProps) {
    const { name, features, isMostPopular, priceUsd } = plan;

    return (
        <article
            className={cn(
                styles.card,
                "flex min-w-0 flex-col",
                isMostPopular
                    ? "relative z-10 rounded-xl bg-surface-raised shadow-plan-selected"
                    : "py-0.5"
            )}
        >
            <div
                className={cn(
                    "flex min-h-15 items-center justify-between px-5 py-2.5",
                    isMostPopular
                        ? "border-b rounded-t-[11px] border-border bg-table-header-background px-5"
                        : "mx-5 border-b border-border px-0"
                )}
            >
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className={cn("text-sm font-normal", isMostPopular ? "text-content-strong" : "text-content-muted")}>
                            {name}
                        </h3>
                        {isMostPopular && (
                            <Badge indicator={false} className="rounded-full bg-brand-soft text-brand">
                                Most popular
                            </Badge>
                        )}
                    </div>
                    <p className="mt-1 whitespace-nowrap font-display text-lg font-semibold text-content-strong">
                        {priceUsd === 0 ? "$0" : <>${priceUsd.toLocaleString("en-US")}</>}
                        <span className="text-base font-normal text-muted-foreground"> / month</span>
                    </p>
                </div>
            </div>
            <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                <ul className="flex flex-col gap-4">
                    {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-base text-plan-feature">
                            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-auto pt-8">
                    {(isCurrent || canUpgrade) && (
                        <Button
                            variant={isMostPopular ? "primary" : "secondary"}
                            className="min-h-9 w-full whitespace-normal"
                            disabled={isCurrent || isUpgradePending || !canUpgrade}
                            onClick={() => {
                                if (canUpgrade) onUpgrade(plan.id);
                            }}
                        >
                            {isCurrent ? "Current plan" : isUpgrading ? "Opening checkout…" : plan.id === "free" ? "Switch to Free" : `Choose ${name}`}
                        </Button>
                    )}
                </div>
            </div>
        </article>
    );
}

/** This month's AI replies against the plan, and the extra replies a paid plan has used. */
function UsageSection({ data }: { data: PlanResponse }) {
    const { replies, limit, extra, extraUsd, period } = data.usage;
    const free = data.currentSubscription.plan.id === "free";
    const share = limit > 0 ? Math.min(100, Math.round((replies / limit) * 100)) : 0;
    const month = new Date(`${period}-01T00:00:00Z`).toLocaleDateString(undefined, { month: "long", year: "numeric", timeZone: "UTC" });
    const full = replies >= limit;
    return (
        <AppSection className="w-full">
            <Heading size="lg">Usage</Heading>
            <AppCard>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-base text-foreground">
                        <span className="font-display text-2xl font-semibold tabular-nums">{replies.toLocaleString("en-US")}</span>
                        <span className="text-muted-foreground"> of {limit.toLocaleString("en-US")} AI replies used in {month}</span>
                    </p>
                    {extra > 0 && (
                        <p className="text-sm text-muted-foreground tabular-nums">
                            + {extra.toLocaleString("en-US")} extra replies · ${extraUsd.toFixed(2)}
                        </p>
                    )}
                </div>
                <div
                    className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-label="AI replies used this month"
                    aria-valuemin={0}
                    aria-valuemax={limit}
                    aria-valuenow={Math.min(replies, limit)}
                >
                    <div className={cn("h-full rounded-full", full && free ? "bg-destructive" : share >= 80 ? "bg-warning" : "bg-brand")} style={{ width: `${share}%` }} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                    {free
                        ? full
                            ? "Your free replies for this month are used up. New chats go to your team in Conversations › Escalated until next month, or choose a paid plan to keep the AI answering."
                            : "On the Free plan the AI stops at 50 replies a month and new chats go to your team. Paid plans keep answering."
                        : "Replies reset on the 1st of each month. Extra replies are billed at the end of your billing period."}
                </p>
            </AppCard>
        </AppSection>
    );
}

export function Plan() {

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
    const currentSubscription = data?.currentSubscription;
    const currentPlanId = data?.currentSubscription?.planId;

    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const carousel = carouselRef.current;
        const popularIndex = plans.findIndex((plan) => plan.isMostPopular);
        if (!carousel || popularIndex < 0 || window.matchMedia("(min-width: 1280px)").matches) return;
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

    if (isLoading) return <Loader className="size-5 animate-spin text-muted-foreground" />

    if (error) {
        return <p className="text-base text-danger">Only the account owner can see billing. If that’s you, refresh and try again.</p>;
    }

    return (
        <>
            <AppSection className="w-full min-w-0 gap-0! overflow-hidden">
                <div className="flex w-full items-center justify-between">
                    <Heading size="lg">Plan</Heading>
                    <div className="flex items-center gap-2 xl:hidden">
                        <Button variant="secondary" size="sm" className="size-6 rounded-md bg-surface-raised p-0!" aria-label="Show previous plan" onClick={() => showPlan(-1)}>
                            <ChevronLeft aria-hidden="true" className="size-3.5" />
                        </Button>
                        <Button variant="secondary" size="sm" className="size-6 rounded-md bg-surface-raised p-0!" aria-label="Show next plan" onClick={() => showPlan(1)}>
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
                                canUpgrade={canUpgradePlan}
                                isUpgradePending={upgradeMutation.isPending}
                                isUpgrading={upgradeMutation.isPending && upgradeMutation.variables === plan.id}
                                onUpgrade={upgradeMutation.mutate}
                            />
                        ))
                    }
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                    A reply is one answer the AI sends a shopper; test chats are free. Paid plans keep answering past their
                    replies, at ${data?.extraReplyUsd?.toFixed(2) ?? "0.04"} for each extra one. Need more than 18,000 a month?{" "}
                    <a href={`${WEBSITE}/#contact-email-field`} className="font-medium text-foreground underline underline-offset-4">Talk to us about Enterprise</a>.
                </p>
            </AppSection>

            {data && <UsageSection data={data} />}

            {currentSubscription && data && <AppSection className="w-full">
                <div className="flex w-full flex-wrap items-center justify-between gap-3">
                    <Heading size="lg">Billing</Heading>
                    {canUpgradePlan && data.billing.canManageBilling && data.billing.billingEnabled && (
                        <Button variant="outline" size="sm" onClick={() => openBillingPortal().catch(() => undefined)}>
                            Manage billing
                        </Button>
                    )}
                </div>
                <AppCard>
                    <DetailContainer fullWidth={true} equalWidth={true}>
                        <DetailGroup>
                            <DetailItem label="Plan" value={currentSubscription.plan?.name || "Free"} />
                        </DetailGroup>
                        <DetailGroup>
                            <DetailItem label="Status" value={STATUS_LABEL[data.billing.status] ?? data.billing.status} />
                        </DetailGroup>
                        <DetailGroup>
                            <DetailItem
                                label={data.billing.status === "canceled" ? "Ends" : "Renews"}
                                value={data.billing.currentPeriodEnd ? dateFormater(data.billing.currentPeriodEnd, "long") : "—"}
                            />
                        </DetailGroup>
                        <DetailGroup>
                            <DetailItem label="Payments" value={data.billing.billingEnabled ? "Card, through Stripe" : "Not set up yet"} />
                        </DetailGroup>
                    </DetailContainer>
                </AppCard>
            </AppSection>}
        </>
    )
}
