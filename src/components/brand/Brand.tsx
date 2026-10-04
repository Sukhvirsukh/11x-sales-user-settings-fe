import { cn } from "@/lib/utils";

/** The brand blue; the star is always this color, whatever the theme. */
export const BRAND_BLUE = "#2F87FF";

/**
 * The 11xsales.ai mark: two slanted bars for "11" and a four-point star for "x".
 * The bars take the current text color, so the mark works on light and dark grounds.
 */
export function BrandMark({ className, starColor = BRAND_BLUE }: { className?: string; starColor?: string }) {
    return (
        <svg viewBox="0 0 352 211" fill="none" aria-hidden="true" className={cn("h-5 w-auto shrink-0", className)}>
            <path d="M42 63H102L61 211H0L42 63Z" fill="currentColor" />
            <path d="M142 0H203L149 211H88L142 0Z" fill="currentColor" />
            <path d="M237 50Q294.5 92 352 50Q310 107.5 352 165Q294.5 123 237 165Q279 107.5 237 50Z" fill={starColor} />
        </svg>
    );
}

/** The app icon: the mark in ink on a brand-blue tile. */
export function BrandIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className={cn("size-8 shrink-0", className)}>
            <rect width="64" height="64" rx="15" fill={BRAND_BLUE} />
            <g transform="translate(9.5 18.25) scale(0.128)" fill="#0B0B0C">
                <path d="M42 63H102L61 211H0L42 63Z" />
                <path d="M142 0H203L149 211H88L142 0Z" />
                <path d="M237 50Q294.5 92 352 50Q310 107.5 352 165Q294.5 123 237 165Q279 107.5 237 50Z" />
            </g>
        </svg>
    );
}

/** The wordmark that follows the mark: "sales" in the text color, ".ai" in brand blue. */
export function BrandWordmark({ className }: { className?: string }) {
    return (
        <span
            className={cn(
                "inline-block font-brand font-black leading-none tracking-[-0.03em] [transform:skewX(-8deg)]",
                className,
            )}
        >
            sales<span style={{ color: BRAND_BLUE }}>.ai</span>
        </span>
    );
}

/** Mark plus wordmark ("11x" + "sales.ai"), as used in the sidebar and on the sign-in screens. */
export function BrandLogo({ className, markClassName, wordClassName }: { className?: string; markClassName?: string; wordClassName?: string }) {
    return (
        <span className={cn("inline-flex items-center gap-3 text-foreground", className)} aria-label="11xsales.ai" role="img">
            <BrandMark className={cn("h-[22px]", markClassName)} />
            <BrandWordmark className={cn("text-[17px]", wordClassName)} />
        </span>
    );
}
