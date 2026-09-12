

type Feature = string[]

export interface Plan {
    id: string,
    code: string,
    name: string,
    priceInr: string,
    isMostPopular: boolean,
    conversationLimit: number,
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
    currentSubscription: currentSubscription
}