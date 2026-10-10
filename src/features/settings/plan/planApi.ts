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
 * Paid plans go through Stripe Checkout (or switch straight away when already
 * subscribed). Going back to Free means cancelling in Stripe's billing portal.
 */
export async function upgradePlan(planId: string) {
    if (planId === "free") {
        const { url } = await apiFetch<{ url: string }>("/billing/portal", { method: "POST" });
        window.location.assign(url);
        return;
    }
    const { url } = await apiFetch<{ url: string | null }>("/billing/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
    });
    if (url) window.location.assign(url);
}
