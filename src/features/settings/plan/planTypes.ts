

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


export interface PlanResponse {
    plans: Plan[],
    currentSubscription: currentSubscription,
    /** AI replies used this calendar month (UTC), across all of the account's stores. */
    usage: { period: string, replies: number, limit: number, extra: number, extraUsd: number },
    /** Price of each reply beyond a paid plan's included replies. */
    extraReplyUsd: number,
    /** What the billing provider reports for the account. */
    billing: {
        status: string,
        currentPeriodEnd: string | null,
        canManageBilling: boolean,
        billingEnabled: boolean,
    },
}