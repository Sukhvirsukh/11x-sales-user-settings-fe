import { apiFetch } from "@/lib/api";
import type { Plan, PlanResponse } from "./planTypes";

// Billing is account-level on the 11xSales backend (/billing), paid through Stripe.

interface ApiPlan {
    code: string;
    name: string;
    priceInr: number;
    isMostPopular: boolean;
    conversationLimit: number;
    features: string[];
    sortOrder: number;
}

interface ApiBilling {
    plans: ApiPlan[];
    current: { plan: ApiPlan; status: string; currentPeriodEnd: string | null; canManageBilling: boolean };
    billingEnabled: boolean;
}

function toPlan(plan: ApiPlan): Plan {
    return { ...plan, id: plan.code, priceInr: plan.priceInr.toFixed(2) };
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
            conversationsUsed: 0,
            createdAt: "",
            updatedAt: "",
            userId: "",
            discountCyclesLeft: null,
            discountPercent: null,
            shopDomain: null,
            shopifySubscriptionId: null,
        },
    };
}

/**
 * Paid plans go through Stripe Checkout (or switch straight away when already
 * subscribed). Going back to Basic means cancelling in Stripe's billing portal.
 */
export async function upgradePlan(planId: string) {
    if (planId === "basic") {
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
