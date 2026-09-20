import type { TrendPoint } from "../overviewType";

/** Number of grid lines on the y-axis. */
const Y_TICKS = 4;

/** Ranges both trend panels can be filtered by. */
export const RANGES = [
    { label: "This month", value: "this-month" },
    { label: "Last month", value: "last-month" },
    { label: "Last 90 days", value: "last-90-days" },
];

/** The API sends the range as a display label; map it back to an option value. */
export function rangeOptionValue(range: string): string {
    return RANGES.find((option) => option.label === range)?.value ?? RANGES[0].value;
}

/** A series point plus its index, which is what the x-axis plots against. */
export type ChartPoint = TrendPoint & { index: number };

export type Scale = {
    /** Bottom of the y-axis. */
    from: number;
    /** Top of the y-axis. */
    to: number;
    /** Values the y-axis labels. */
    ticks: number[];
};

/** Adds the x-axis index to each point so the axis can plot against it. */
export function toChartData(series: TrendPoint[]): ChartPoint[] {
    return series.map((point, index) => ({ ...point, index }));
}

/** Y-axis bounds and ticks that always fit the series. */
export function scaleFor(values: number[]): Scale {
    const min = Math.min(...values);
    const max = Math.max(...values);
    // Pad the range so the line never touches the edges. When every point is the
    // same, pad by the value itself so the axis still has a height.
    const padding = (max - min || max) * 0.1;
    const from = Math.max(0, min - padding);
    const to = max + padding;
    const step = (to - from) / (Y_TICKS - 1);

    return { from, to, ticks: Array.from({ length: Y_TICKS }, (_, index) => from + step * index) };
}

/**
 * X positions halfway between months, so the chart can draw a separator at each
 * month boundary instead of one line per data point.
 */
export function monthBoundaries(count: number): number[] {
    return Array.from({ length: Math.max(count - 1, 0) }, (_, index) => index + 0.5);
}

/** The highest and lowest points of a series — the ones worth calling out. */
export function extremes(points: ChartPoint[]) {
    // Safe without an initial value: callers never pass an empty series.
    const highest = points.reduce((max, point) => (point.value > max.value ? point : max));
    const lowest = points.reduce((min, point) => (point.value < min.value ? point : min));

    return { highest, lowest };
}

/** Places a callout over its point, clamped so the label stays inside the plot area. */
export function calloutPosition(point: ChartPoint, count: number, scale: Scale) {
    const left = count > 1 ? (point.index / (count - 1)) * 90 + 4 : 50;
    const top = ((scale.to - point.value) / (scale.to - scale.from)) * 100;

    return { left: `${Math.min(left, 86)}%`, top: `${Math.min(Math.max(top, 10), 90)}%` };
}
