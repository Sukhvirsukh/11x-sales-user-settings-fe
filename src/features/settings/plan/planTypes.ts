

type Feature = string[]

export interface Plan {
    id: string,
    code: string,
    name: string,
    /** Monthly price in US dollars (0 for Free). */
    priceUsd: number,
    isMostPopular: boolean,
    /** AI replies included each month. */
    replyLimit: number,
    features: Feature,
    sortOrder: number,
}

export interface currentSubscription {

    conversationsUsed: number,
    createdAt: string,
    currentPeriodEnd: null,
    currentPeriodStart: string,
    discountCyclesLeft: null,
    discountPercent: null,
    id: string,
    plan: Plan,
    planId: string,
    shopDomain: null,
    shopifySubscriptionId: null,
    status: string,
    updatedAt: string,
    userId: string,
}


/** null means unlimited. */
export interface LimitUsage { used: number, limit: number | null, over: boolean }

export interface PlanResponse {
    plans: Plan[],
    currentSubscription: currentSubscription,
    /** AI replies used this calendar month (UTC), across all of the account's stores. */
    usage: { period: string, replies: number, limit: number, extra: number, extraUsd: number },
    /** Price of each reply beyond a paid plan's included replies. */
    extraReplyUsd: number,
    /** Who takes payment: Shopify (the merchant's Shopify bill) or Stripe. */
    provider: "shopify" | "stripe",
    /** Shopify billing: the connected store the plan is billed to (null until one is connected). */
    shopifyStore: string | null,
    /** Whether this server can bill through Shopify yet (the Shopify app is set up). */
    shopifyAvailable: boolean,
    /** What the billing provider reports for the account. */
    billing: {
        status: string,
        currentPeriodEnd: string | null,
        canManageBilling: boolean,
        billingEnabled: boolean,
        /** The most extra replies can cost in a month (null on Free and during the trial). */
        extraRepliesCapUsd: number | null,
    },
    /** The free days of the first paid plan: on offer (`available`) or running (`active`, until `endsAt`). */
    trial: { days: number, available: boolean, active: boolean, endsAt: string | null },
    /** Stores and team seats used against the plan's limits. */
    limits: {
        stores: LimitUsage,
        seats: LimitUsage,
        knowledgePages: { limit: number | null },
    },
    enterprise: { name: string, price: string, description: string, features: string[], contactUrl: string },
    /** Paying by card but now a Shopify merchant: approving a Shopify plan ends the card subscription. */
    cardSubscriptionEndsOnShopifyApproval: boolean,
}