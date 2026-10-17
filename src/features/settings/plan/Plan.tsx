import { SOCIAL_CHANNELS_ENABLED } from "@/config/features";
import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import DetailContainer, { DetailGroup, DetailItem } from "@/components/design/DetailContainer";
import Heading from "@/components/design/Heading";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "@/components/ui/toast-manager";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useCan } from "@/features/auth";
import styles from "./Plan.module.css";
import { cn, dateFormater } from "@/lib/utils";
import { planQueryKey, usePlanQuery } from "./planQuery";
import type { LimitUsage, Plan as PlanData, PlanResponse } from "./planTypes";
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
    /** Free days this plan would start with (the first paid plan only), else null. */
    trialDays: number | null;
    onUpgrade: (planId: string) => void;
}

const EMPTY_PLANS: PlanData[] = [];

function PlanCard({ plan, isCurrent, canUpgrade, isUpgradePending, isUpgrading, trialDays, onUpgrade }: PlanCardProps) {
    const startsTrial = Boolean(trialDays) && plan.id !== "free" && !isCurrent;
    const { name, isMostPopular, priceUsd } = plan;
    // The social channels are hidden for now, so their plan line is too.
    const features = SOCIAL_CHANNELS_ENABLED ? plan.features : plan.features.filter((f) => !/whatsapp|instagram|messenger/i.test(f));

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
                            {isCurrent
                                ? "Current plan"
                                : isUpgrading
                                    ? "Opening checkout…"
                                    : plan.id === "free"
                                        ? "Switch to Free"
                                        : startsTrial
                                            ? `Start ${trialDays}-day free trial`
                                            : `Choose ${name}`}
                        </Button>
                    )}
                    {Boolean(trialDays) && (
                        // Same height on every card, so the buttons line up.
                        <p
                            className={cn("mt-2 text-center text-xs text-muted-foreground", !(startsTrial && canUpgrade) && "invisible")}
                            aria-hidden={!(startsTrial && canUpgrade)}
                        >
                            Then ${priceUsd.toLocaleString("en-US")}/month. Cancel before the trial ends to pay nothing.
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}

function limitText({ used, limit }: LimitUsage) {
    return limit === null ? `${used.toLocaleString("en-US")} · unlimited` : `${used.toLocaleString("en-US")} of ${limit.toLocaleString("en-US")}`;
}

/** Stores and team seats against the plan; over a limit after a downgrade, nothing new can be added. */
function LimitsSection({ data }: { data: PlanResponse }) {
    const { stores, seats, knowledgePages } = data.limits;
    const over = stores.over || seats.over;
    return (
        <AppSection className="w-full">
            <Heading size="lg">Plan limits</Heading>
            <AppCard>
                <DetailContainer fullWidth={true} equalWidth={true}>
                    <DetailGroup>
                        <DetailItem label="Stores" value={limitText(stores)} />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem label="Team seats" value={limitText(seats)} />
                    </DetailGroup>
                    <DetailGroup>
                        <DetailItem
                            label="Knowledge pages"
                            value={knowledgePages.limit === null ? "Unlimited" : `Up to ${knowledgePages.limit.toLocaleString("en-US")}`}
                        />
                    </DetailGroup>
                </DetailContainer>
                {over && (
                    <p className="mt-3 text-sm text-warning">
                        You have more {stores.over ? "stores" : "team members"} than your plan includes. Everything keeps
                        working, but you can&rsquo;t add more until you upgrade or remove some.
                    </p>
                )}
            </AppCard>
        </AppSection>
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
                        : data.trial.active
                            ? `During your free trial the AI answers up to ${limit.toLocaleString("en-US")} replies, with nothing charged. After the trial, extra replies are billed.`
                            : `Replies reset on the 1st of each month. Extra replies are billed at the end of your billing period${data.billing.extraRepliesCapUsd ? `, up to $${data.billing.extraRepliesCapUsd.toLocaleString("en-US")} a month` : ""}.`}
                </p>
            </AppCard>
        </AppSection>
    );
}

export function Plan() {

    const { data, isLoading, error } = usePlanQuery();
    const canUpgradePlan = useCan("settings.plan.create");
    const queryClient = useQueryClient();
    // Paid plans need an explicit yes to the trial and recurring billing terms first.
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const upgradeMutation = useMutation({
        mutationFn: (planId: string) => {
            if (!canUpgradePlan) {
                return Promise.reject(new Error("You do not have permission to upgrade the plan."));
            }
            if (planId !== "free" && !acceptedTerms) {
                toast.add({ type: "error", title: "Plan", description: "Tick the box to accept the trial and billing terms first." });
                return Promise.resolve();
            }
            return upgradePlan(planId, planId !== "free" && acceptedTerms);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: planQueryKey });
        },
    });
    // Back from Shopify's (or Stripe's) approval page: say how it went, then tidy the address bar.
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        const outcome = searchParams.get("billing");
        if (!outcome) return;
        const messages: Record<string, ["success" | "error", string]> = {
            success: ["success", "Your new plan is active."],
            cancelled: ["error", "The plan wasn't approved, so nothing changed."],
            error: ["error", "We couldn't confirm the plan. Please try again."],
        };
        const [type, description] = messages[outcome] ?? messages.error;
        toast.add({ type, title: "Plan", description });
        void queryClient.invalidateQueries({ queryKey: planQueryKey });
        const next = new URLSearchParams(searchParams);
        next.delete("billing");
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams, queryClient]);

    const plans = data?.plans ?? EMPTY_PLANS;
    const viaShopify = data?.provider === "shopify";
    // Paid plans need a way to pay: with Shopify billing, a connected store.
    const canChoosePaid = Boolean(data?.billing.billingEnabled);
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

    // The first paid plan starts with free days (never during or after a trial).
    const trialDays = data?.trial.available ? data.trial.days : null;

    if (isLoading) return <Loader className="size-5 animate-spin text-muted-foreground" />

    if (error) {
        return <p className="text-base text-danger">Only the account owner can see billing. If that’s you, refresh and try again.</p>;
    }

    return (
        <>
            {data?.trial.active && data.trial.endsAt && (
                <p className="w-full rounded-lg border border-border-subtle bg-brand-soft px-3 py-2 text-sm text-foreground" role="status">
                    Your free trial of <span className="font-medium">{data.currentSubscription.plan.name}</span> ends on{" "}
                    <span className="font-medium">{dateFormater(data.trial.endsAt, "long")}</span>. Nothing is charged until then;
                    switch to Free before that date to pay nothing.
                </p>
            )}
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
                                canUpgrade={canUpgradePlan && (plan.id === "free" || canChoosePaid)}
                                isUpgradePending={upgradeMutation.isPending}
                                isUpgrading={upgradeMutation.isPending && upgradeMutation.variables === plan.id}
                                trialDays={trialDays}
                                onUpgrade={upgradeMutation.mutate}
                            />
                        ))
                    }
                </div>
                {canUpgradePlan && canChoosePaid && (
                    <label className="mt-1 flex w-full cursor-pointer items-start gap-2.5 rounded-lg border border-border-subtle bg-surface-raised px-3 py-2.5 text-sm text-foreground">
                        <Checkbox
                            className="mt-0.5"
                            checked={acceptedTerms}
                            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                            aria-label="I accept the trial and billing terms"
                        />
                        <span>
                            I agree to the{" "}
                            <a href={`${WEBSITE}/terms`} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
                                billing terms
                            </a>
                            :{" "}
                            {trialDays ? `the first ${trialDays} days are free, then ` : ""}
                            the plan renews every 30 days{viaShopify ? " on my Shopify bill" : ""} until I cancel, and extra replies
                            cost ${data?.extraReplyUsd?.toFixed(2) ?? "0.06"} each up to the monthly cap.
                        </span>
                    </label>
                )}
                {viaShopify && (
                    <p className="mt-1 w-full rounded-lg border border-border-subtle bg-surface-subtle px-3 py-2 text-sm text-muted-foreground">
                        {!data?.shopifyAvailable
                            ? <>Paid plans open soon. They&rsquo;ll be billed by Shopify, on your store&rsquo;s Shopify invoice.</>
                            : data?.shopifyStore
                                ? <>Plans are billed by Shopify, on the Shopify invoice of <span className="font-medium text-foreground">{data.shopifyStore}</span>. You&rsquo;ll approve the charge in Shopify.</>
                                : <>Plans are billed by Shopify. <a href="/chat-settings?connectShopify=" className="font-medium text-foreground underline underline-offset-4">Connect your Shopify store</a> (Chat setup › Integration) to choose a paid plan.</>}
                        {data?.cardSubscriptionEndsOnShopifyApproval && (
                            <> Your card subscription ends when you approve a plan in Shopify, so you&rsquo;re never billed twice.</>
                        )}
                    </p>
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                    A reply is one answer the AI sends a shopper; test chats are free. Paid plans keep answering past their
                    replies, at ${data?.extraReplyUsd?.toFixed(2) ?? "0.06"} for each extra one, up to a monthly cap of twice the
                    plan price.{trialDays ? ` Your first paid plan starts with ${trialDays} days free; you approve the payment method now.` : ""}{" "}
                    Need more than 18,000 a month?{" "}
                    <a href={data?.enterprise.contactUrl || `${WEBSITE}/#contact-email-field`} className="font-medium text-foreground underline underline-offset-4">Talk to us about Enterprise</a>.
                </p>
            </AppSection>

            {data && <UsageSection data={data} />}

            {data && <LimitsSection data={data} />}

            {currentSubscription && data && <AppSection className="w-full">
                <div className="flex w-full flex-wrap items-center justify-between gap-3">
                    <Heading size="lg">Billing</Heading>
                    {canUpgradePlan && data.billing.canManageBilling && data.billing.billingEnabled && (
                        <Button variant="outline" size="sm" onClick={() => openBillingPortal().catch(() => undefined)}>
                            {viaShopify ? "Manage in Shopify" : "Manage billing"}
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
                            {data.trial.active && data.trial.endsAt
                                ? <DetailItem label="Trial ends" value={dateFormater(data.trial.endsAt, "long")} />
                                : <DetailItem
                                    label={data.billing.status === "canceled" ? "Ends" : "Renews"}
                                    value={data.billing.currentPeriodEnd ? dateFormater(data.billing.currentPeriodEnd, "long") : "—"}
                                />}
                        </DetailGroup>
                        <DetailGroup>
                            <DetailItem
                                label="Payments"
                                value={viaShopify
                                    ? data.shopifyStore ? "On your Shopify bill" : "Connect Shopify to pay"
                                    : data.billing.billingEnabled ? "Card, through Stripe" : "Not set up yet"}
                            />
                        </DetailGroup>
                    </DetailContainer>
                </AppCard>
            </AppSection>}
        </>
    )
}
