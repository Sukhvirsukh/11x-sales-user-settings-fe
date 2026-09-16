export interface IntegrationResponse {
    shopify?: {
        connected?: boolean;
    };
}


export interface Configuration {
    ignoreOutOfStockProducts: 'out-of-stock' | 'discontinued',
    ignoreElements: string[],
    crawlInterval: string,
    rateLimit: number | null,
    rateLimitPeriodMinutes: number | null,
    messageWhenLimitReached: string | null,
    enableUtmTracking: boolean
}
