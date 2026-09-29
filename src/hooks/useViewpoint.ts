import { useCallback, useMemo, useSyncExternalStore } from "react"

/**
 * Breakpoint widths mirrored from Tailwind's defaults (`sm` 40rem … `2xl`
 * 96rem), plus this project's extra `xs` (`src/index.css`). Shared with the
 * `sm:`/`lg:`/… variants through the same `rem` values, so the hook and the
 * CSS classes always flip at the same pixel.
 */
export const VIEWPOINTS = {
    xs: "30rem",
    sm: "40rem",
    md: "48rem",
    lg: "64rem",
    xl: "80rem",
    "2xl": "96rem",
} as const

export type Viewpoint = keyof typeof VIEWPOINTS

/**
 * `true` from `viewpoint` up — the `min-width` boundary Tailwind uses for its
 * unprefixed-of-that-tier variants, so `useViewpoint("lg")` and `lg:`/`max-lg:`
 * agree. Negate it for the "below" direction: `!useViewpoint("lg")`.
 *
 * `matchMedia` is an external store, so this subscribes through
 * `useSyncExternalStore` instead of mirroring it into state inside an effect:
 * there is no state to keep in sync, no `setState` in an effect, and no
 * tearing between the value read during render and the one after subscribing.
 * The `MediaQueryList` is memoised so its identity — and therefore
 * `subscribe` — stays stable across renders and the listener is only re-bound
 * when the caller asks for a different `viewpoint`.
 */
export function useViewpoint(viewpoint: Viewpoint): boolean {
    // `rem` matches Tailwind's own breakpoints; the range is inclusive, so `lg`
    // is true at exactly 64rem, mirroring `@media (min-width: 64rem)`.
    const query = `(min-width: ${VIEWPOINTS[viewpoint]})`

    const mediaQueryList = useMemo(() => window.matchMedia(query), [query])

    const subscribe = useCallback((onStoreChange: () => void) => {
        mediaQueryList.addEventListener("change", onStoreChange)
        return () => mediaQueryList.removeEventListener("change", onStoreChange)
    }, [mediaQueryList])

    return useSyncExternalStore(subscribe, () => mediaQueryList.matches)
}
