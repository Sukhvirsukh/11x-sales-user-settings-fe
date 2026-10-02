/**
 * Animated atom loader: two 3D rings (`::before` / `::after`) orbit a shared axis.
 * The orbit rides on a *static* `box-shadow` offset that spins with the element's
 * `transform`, so the browser composites it. Animating `box-shadow` itself repaints
 * every frame, which is what made the motion look choppy.
 *
 * The CSS lives in this file as a hoisted <style> element; React 19 dedupes it by
 * `href`, so mounting several loaders only injects the rules once. The keyframes are
 * namespaced (`loader-orbit-*`) because Tailwind ships its own global `@keyframes spin`
 * for `animate-spin`, and the duplicate name silently killed this animation.
 */

const LOADER_STYLES = `.loader {
  --color-1: #000000;
  --color-2: #3576F3;
  --size: 1.6px;

  /* A <span> is inline by default, where width/height/transform are ignored, so the
     box collapsed and the absolutely positioned rings escaped to the page corner. */
  display: inline-block;
  position: relative;
  transform: rotateZ(45deg);
  perspective: calc(1000 * var(--size));
  border-radius: 50%;
  width: calc(48 * var(--size));
  height: calc(48 * var(--size));
  color: var(--color-1);
}
.loader:before,
.loader:after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: inherit;
  height: inherit;
  border-radius: 50%;
  box-shadow: 0.2em 0 0 0 currentcolor;
  will-change: transform;
}
.loader:before {
  transform: rotateX(70deg);
  animation: 0.6s loader-orbit-x linear infinite;
}
.loader:after {
  color: var(--color-2);
  transform: rotateY(70deg);
  animation: 0.6s loader-orbit-y linear infinite;
  animation-delay: 0.3s;
}

@keyframes loader-orbit-x {
  from {
    transform: rotateX(70deg) rotate(0deg);
  }
  to {
    transform: rotateX(70deg) rotate(360deg);
  }
}

@keyframes loader-orbit-y {
  from {
    transform: rotateY(70deg) rotate(0deg);
  }
  to {
    transform: rotateY(70deg) rotate(360deg);
  }
}

`;

export default function LoadingScreen() {
  return (
    <>
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background">
        <style href="loading-screen" precedence="default">
          {LOADER_STYLES}
        </style>
        <span className="loader" role="status" aria-label="Loading" />
        <p className="text-sm text-muted-foreground">Loading your workspace…</p>
      </div>
    </>
  );
}
