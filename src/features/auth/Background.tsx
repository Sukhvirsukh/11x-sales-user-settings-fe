export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 760"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <rect width="1440" height="760" fill="#F1F1F1" />

        {/* Flowing wave lines */}
        {wavePaths.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#3576F3"
            strokeOpacity={0.2}
            strokeWidth={0.88}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}

        {/* Subtle blurred blue rectangle at bottom */}
        <g filter="url(#blur-filter)">
          <rect
            x="547"
            y="533"
            width="346"
            height="118"
            rx="10"
            fill="#3576F3"
            fillOpacity={0.2}
          />
        </g>

        <defs>
          <filter
            id="blur-filter"
            x="447"
            y="433"
            width="546"
            height="318"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="50" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

/**
 * Generates flowing wave paths that curve from left to right
 * with increasing size as they go down the viewport.
 */
function generateWavePaths(): string[] {
  const paths: string[] = [];
  const count = 22;
  const startY = 23.3;
  const spacing = 36;
  const endY = -20;

  for (let n = 0; n < count; n++) {
    const sy = startY + n * spacing;

    // First cubic Bézier control points
    const cp2x1 = -0.2 + 26.2 * n;
    const cp2y1 = 15.2 + 32.7 * n;

    const endX1 = 2.9 + 32.9 * n;
    const endY1 = 2 + 17.25 * n;

    // Second cubic Bézier control points
    const cp1x2 = 6 + 39.2 * n;
    const cp1y2 = -11.2 + 2.5 * n;

    const endX2 = 17.5 + 65.7 * n;

    const d = [
      `M -11 ${sy}`,
      `C -11 ${sy} ${cp2x1} ${cp2y1} ${endX1} ${endY1}`,
      `C ${cp1x2} ${cp1y2} ${endX2} ${endY} ${endX2} ${endY}`,
    ].join(" ");

    paths.push(d);
  }

  return paths;
}

const wavePaths = generateWavePaths();
