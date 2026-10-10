import { apiFetch } from "@/lib/api";
import type { Plan, PlanResponse } from "./planTypes";

// Billing is account-level on the 11xSales backend (/billing), paid through Stripe.

interface ApiPlan {
    code: string;
    name: string;
    priceUsd: number;
    isMostPopular: boolean;
    replyLimit: number;
    features: string[];
    sortOrder: number;
}

interface ApiBilling {
    plans: ApiPlan[];
    extraReplyUsd: number;
    current: { plan: ApiPlan; status: string; currentPeriodEnd: string | null; canManageBilling: boolean };
    usage: PlanResponse["usage"];
    provider: PlanResponse["provider"];
    shopifyStore: string | null;
    shopifyAvailable?: boolean;
    billingEnabled: boolean;
}

function toPlan(plan: ApiPlan): Plan {
    return { ...plan, id: plan.code };
}

export async function getPlans(): Promise<PlanResponse> {
    const billing = await apiFetch<ApiBilling>("/billing");
    const current = toPlan(billing.current.plan);
    return {
        plans: billing.plans.map(toPlan),
        currentSubscription: {
            id: current.id,
            planId: current.id,
            plan: current,
            status: billing.current.status,
            currentPeriodEnd: billing.current.currentPeriodEnd as null,
            // The free plan has no billing period; its usage resets monthly from today.
            currentPeriodStart: new Date().toISOString(),
            conversationsUsed: billing.usage.replies,
            createdAt: "",
            updatedAt: "",
            userId: "",
            discountCyclesLeft: null,
            discountPercent: null,
            shopDomain: null,
            shopifySubscriptionId: null,
        },
        usage: billing.usage,
        extraReplyUsd: billing.extraReplyUsd,
        provider: billing.provider ?? "stripe",
        shopifyStore: billing.shopifyStore ?? null,
        shopifyAvailable: Boolean(billing.shopifyAvailable),
        billing: {
            status: billing.current.status,
            currentPeriodEnd: billing.current.currentPeriodEnd,
            canManageBilling: billing.current.canManageBilling,
            billingEnabled: billing.billingEnabled,
        },
    };
}

/** Stripe's billing portal: card, invoices, cancelling. */
export async function openBillingPortal() {
    const { url } = await apiFetch<{ url: string }>("/billing/portal", { method: "POST" });
    window.location.assign(url);
}

/**
 * Paid plans open the payment provider's approval page: Shopify's (the charge
 * goes on the store's Shopify bill) or Stripe Checkout. Going back to Free
 * cancels the subscription.
 */
export async function upgradePlan(planId: string) {
    if (planId === "free") {
        // Shopify cancels straight away (url null); Stripe cancels in its portal.
        const { url } = await apiFetch<{ url: string | null }>("/billing/cancel", { method: "POST" });
        if (url) window.location.assign(url);
        return;
    }
    const { url } = await apiFetch<{ url: string | null }>("/billing/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
    });
    if (url) window.location.assign(url);
}
