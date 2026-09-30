import { useEffect, useRef, useState } from "react"

export interface InfiniteScrollOptions {
    /** Fetch the page after the rows already loaded. */
    onLoadMore: () => void
    /** The server still holds rows after the loaded ones. */
    hasMore: boolean
    /** A page is in flight. */
    isFetching: boolean
}

/**
 * Hand the returned ref to the element that ends a list, and `onLoadMore` runs once the reader
 * scrolls it into view.
 *
 * The listener sits on the document in the capture phase, so whichever ancestor actually scrolls
 * counts (the page on mobile, `main` on desktop). Because it is scroll driven, the next page waits
 * for the reader instead of firing as soon as the list mounts, and only a scroll that moves the
 * sentinel up the screen counts — a shrinking list makes the browser clamp its scroll position and
 * emit a scroll of its own, which must not look like the end being reached. `onLoadMore` and
 * `isFetching` are read through refs, so a new callback identity never re-attaches the listener and
 * a burst of scroll events asks for one page at a time.
 *
 * ```tsx
 * const sentinelRef = useInfiniteScroll({ onLoadMore: fetchNextPage, hasMore, isFetching })
 * return <div ref={sentinelRef}>{isFetching && <Spinner />}</div>
 * ```
 */
export function useInfiniteScroll<T extends HTMLElement = HTMLElement>({
    onLoadMore,
    hasMore,
    isFetching,
}: InfiniteScrollOptions) {
    // Held in state so the element can be observed as soon as it shows up, even when the list
    // renders empty first and grows later.
    const [sentinel, setSentinel] = useState<T | null>(null)
    const latest = useRef({ onLoadMore, isFetching })
    // Blocks a second request until the one in flight has settled.
    const requested = useRef(false)

    useEffect(() => {
        latest.current = { onLoadMore, isFetching }
        if (!isFetching) requested.current = false
    })

    useEffect(() => {
        if (!sentinel || !hasMore) return
        let lastTop = sentinel.getBoundingClientRect().top
        const onScroll = () => {
            const top = sentinel.getBoundingClientRect().top
            const scrolledDown = top <= lastTop
            lastTop = top
            if (!scrolledDown || top > window.innerHeight) return
            if (latest.current.isFetching || requested.current) return
            requested.current = true
            latest.current.onLoadMore()
        }
        document.addEventListener("scroll", onScroll, { capture: true, passive: true })
        return () => document.removeEventListener("scroll", onScroll, { capture: true })
    }, [sentinel, hasMore])

    return setSentinel
}
