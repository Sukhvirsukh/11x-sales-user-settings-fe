import {
    Area,
    ComposedChart,
    Line,
    ReferenceDot,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

import Heading from "@/components/design/Heading";
import { SelectField } from "@/components/design/SelectField";
import AppSection from "@/components/design/AppSectoin";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";
import type { ChatToSaleConversion, ChatToSalePoint } from "../overviewType";

const RANGES = [
    { label: "This month", value: "this-month" },
    { label: "Last month", value: "last-month" },
    { label: "Last 90 days", value: "last-90-days" },
];

/** Number of grid lines on the y-axis. */
const Y_TICKS = 4;

/** A series point plus its index, which is what the x-axis plots against. */
type ChartPoint = ChatToSalePoint & { index: number };

/** Y-axis bounds and ticks that always fit the series. */
function scaleFor(values: number[]) {
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

/** Places a callout over its point, clamped so the label stays inside the plot area. */
function calloutPosition(point: ChartPoint, count: number, scale: ReturnType<typeof scaleFor>) {
    const left = count > 1 ? (point.index / (count - 1)) * 90 + 4 : 50;
    const top = ((scale.to - point.value) / (scale.to - scale.from)) * 100;

    return { left: `${Math.min(left, 86)}%`, top: `${Math.min(Math.max(top, 10), 90)}%` };
}

/** Renders the trend, marking the peak and trough of the series. */
function ConversionTrend({ title, range, series }: ChatToSaleConversion) {
    const chartData: ChartPoint[] = series.map((point, index) => ({ ...point, index }));
    const scale = scaleFor(series.map(({ value }) => value));

    // Safe without an initial value: the caller never renders an empty series.
    const highest = chartData.reduce((max, point) => (point.value > max.value ? point : max));
    const lowest = chartData.reduce((min, point) => (point.value < min.value ? point : min));

    const callouts = [
        { label: "High ", tone: "text-chart-tooltip-high", point: highest },
        { label: "Low ", tone: "text-chart-tooltip-low", point: lowest },
    ];

    return (
        <div className="w-full">
            <div className="mb-4 flex items-center justify-between gap-4">
                <Heading size="lg">{title}</Heading>
                <div className="">
                    <SelectField
                        className="h-7 "
                        // The API sends the range as a display label; map it back to an option value.
                        defaultValue={RANGES.find((option) => option.label === range)?.value ?? RANGES[0].value}
                        options={RANGES}
                    />
                </div>
            </div>

            <div className="relative h-45 w-full sm:h-47.5">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 8, right: 10, bottom: 0, left: -12 }}>
                        <XAxis
                            dataKey="index"
                            type="number"
                            domain={[0, chartData.length - 1]}
                            ticks={chartData.map(({ index }) => index)}
                            tickFormatter={(index) => series[index]?.month ?? ""}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            domain={[scale.from, scale.to]}
                            ticks={scale.ticks}
                            tickFormatter={(value) => formatNumber(value)}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
                            width={48}
                        />
                        <Area type="linear" dataKey="value" stroke="none" fill="white" baseValue={scale.from} isAnimationActive={false} />
                        <Line type="linear" dataKey="value" stroke="var(--primary)" strokeWidth={1.25} dot={false} activeDot={false} isAnimationActive={false} />
                        <ReferenceDot x={highest.index} y={highest.value} r={3.5} fill="var(--chart-high-marker)" stroke="var(--chart-marker-border)" />
                        <ReferenceDot x={lowest.index} y={lowest.value} r={3.5} fill="var(--chart-low-marker)" stroke="var(--chart-marker-border)" />
                    </ComposedChart>
                </ResponsiveContainer>

                {callouts.map(({ label, tone, point }) => (
                    <div
                        key={label}
                        style={calloutPosition(point, chartData.length, scale)}
                        className="pointer-events-none absolute z-10 hidden -translate-y-1/2 rounded border border-chart-tooltip-border bg-chart-tooltip-background px-1.5 py-0.5 text-xs text-chart-tooltip-foreground shadow-sm sm:block"
                    >
                        {label}
                        <span className={tone}>{formatNumber(point.value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface ChatToSaleChartProps {
    /** Chat-to-sale section of the Overview response. */
    conversion?: ChatToSaleConversion;
    /** True while the Overview request is in flight. */
    isLoading?: boolean;
}

export default function ChatToSaleChart({ conversion, isLoading = false }: ChatToSaleChartProps) {
    if (isLoading) {
        return (
            <AppSection className="h-auto">
                <Skeleton className="h-60 w-full" />
            </AppSection>
        );
    }

    if (!conversion || conversion.series.length === 0) {
        return (
            <AppSection className="h-auto">
                <p className="flex h-45 w-full items-center justify-center text-sm text-content-muted">
                    No conversion data for this range.
                </p>
            </AppSection>
        );
    }

    return (
        <AppSection className="h-auto">
            <ConversionTrend {...conversion} />
        </AppSection>
    );
}
