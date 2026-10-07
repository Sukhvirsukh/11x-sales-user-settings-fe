import { cn } from "@/lib/utils";

/** The brand blue from the 11xsales.ai logo sheet; the star is always this color. */
export const BRAND_BLUE = "#2F86FF";

/** The mark's shapes on the sheet's 200 × 120 canvas: two bars ("11") and a star ("x"). */
const BAR_LEFT = "8,112 38,112 58,40 28,40";
const BAR_RIGHT = "50,112 80,112 106,10 76,10";
const STAR = "M120,32 Q150,56 180,32 Q156,62 180,92 Q150,68 120,92 Q144,62 120,32 Z";

/**
 * The 11xsales.ai mark. The bars take the current text color (white on dark,
 * ink on light, as on the sheet); the star is brand blue unless told otherwise.
 */
export function BrandMark({ className, starColor = BRAND_BLUE }: { className?: string; starColor?: string }) {
    return (
        <svg viewBox="0 0 200 120" fill="none" aria-hidden="true" className={cn("h-[34px] w-auto shrink-0", className)}>
            <polygon points={BAR_LEFT} fill="currentColor" />
            <polygon points={BAR_RIGHT} fill="currentColor" />
            <path d={STAR} fill={starColor} />
        </svg>
    );
}

/** The app icon: the whole mark in ink on a brand-blue tile (25% corner radius). */
export function BrandIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 152 152" aria-hidden="true" className={cn("size-8 shrink-0", className)}>
            <rect width="152" height="152" rx="38" fill={BRAND_BLUE} />
            <g transform="translate(17 40.5) scale(0.59)" fill="#0B0B0C">
                <polygon points={BAR_LEFT} />
                <polygon points={BAR_RIGHT} />
                <path d={STAR} />
            </g>
        </svg>
    );
}

/** "sales.ai" set as on the sheet: Unbounded Black, −0.04em tracking, slanted 8°. */
export function BrandWordmark({ className }: { className?: string }) {
    return (
        <span className={cn("inline-block font-brand font-black leading-none tracking-[-0.04em] whitespace-nowrap [transform:skewX(-8deg)]", className)}>
            sales<span style={{ color: BRAND_BLUE }}>.ai</span>
        </span>
    );
}

/**
 * The full lockup: mark, then "sales.ai" — read together as "11xsales.ai".
 * Proportions follow the sheet (mark 50px tall : text 28px : gap 10px), so pass
 * sizes in that ratio when scaling it.
 */
export function BrandLogo({ className, markClassName, wordClassName }: { className?: string; markClassName?: string; wordClassName?: string }) {
    return (
        <span className={cn("inline-flex items-center gap-[7px] text-foreground", className)} aria-label="11xsales.ai" role="img">
            <BrandMark className={markClassName} />
            <BrandWordmark className={cn("text-[19px]", wordClassName)} />
        </span>
    );
}
