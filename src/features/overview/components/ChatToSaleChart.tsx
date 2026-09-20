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
import type { TrendPanel } from "../overviewType";
import { RANGES, calloutPosition, extremes, rangeOptionValue, scaleFor, toChartData } from "./trendChart";

/** Renders the trend, marking the peak and trough of the series. */
function ConversionTrend({ title, range, series }: TrendPanel) {
    const chartData = toChartData(series);
    const scale = scaleFor(series.map(({ value }) => value));
    const { highest, lowest } = extremes(chartData);

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
                        defaultValue={rangeOptionValue(range)}
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
                        <Area type="linear" dataKey="value" stroke="none" fill="var(--surface-raised)" baseValue={scale.from} isAnimationActive={false} />
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
    /** `chatToSaleConversion` section of the Overview response. */
    panel?: TrendPanel;
    /** True while the Overview request is in flight. */
    isLoading?: boolean;
}

export default function ChatToSaleChart({ panel, isLoading = false }: ChatToSaleChartProps) {
    if (isLoading) {
        return (
            <AppSection className="h-auto">
                <Skeleton className="h-60 w-full" />
            </AppSection>
        );
    }

    if (!panel || panel.series.length === 0) {
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
            <ConversionTrend {...panel} />
        </AppSection>
    );
}
