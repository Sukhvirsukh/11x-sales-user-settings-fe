export interface IntegrationResponse {
    shopify?: {
        connected?: boolean;
    };
}


export interface Configuration {
    ignoreProducts: 'out-of-stock' | 'discontinued',
    ignoreElements: string[],
    crawlInterval: string,
    rateLimit: number | null,
    rateLimitPerPeriod: number | null,
    messageWhenLimitReached: string | null,
    enableUtmTracking: boolean
}
