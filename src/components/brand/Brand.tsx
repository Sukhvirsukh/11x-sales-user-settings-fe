import { cn } from "@/lib/utils";

/** The 11xSales mark: two strokes for the "11" and a signal-orange multiplier. */
export function BrandMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn("size-7 shrink-0", className)}>
            <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill="#16181D" stroke="#FFFFFF" strokeOpacity="0.08" />
            <rect x="7" y="9" width="3" height="14" rx="1.5" fill="#FFFFFF" />
            <rect x="12.5" y="9" width="3" height="14" rx="1.5" fill="#FFFFFF" />
            <path d="M19 11.5L25 20.5M25 11.5L19 20.5" stroke="#F0562A" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

/** Mark plus wordmark, as used in the sidebar and on the sign-in screens. */
export function BrandLogo({ className, markClassName }: { className?: string; markClassName?: string }) {
    return (
        <span className={cn("inline-flex items-center gap-2.5", className)}>
            <BrandMark className={markClassName} />
            <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-foreground">
                11x<span className="text-brand">Sales</span>
            </span>
        </span>
    );
}
