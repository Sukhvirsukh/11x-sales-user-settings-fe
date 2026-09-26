import {
    Area,
    ComposedChart,
    Line,
    ReferenceDot,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

import { SelectField } from "@/components/design/SelectField";
import AppSection from "@/components/design/AppSectoin";
import Heading from "@/components/design/Heading";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";
import type { TrendPanel } from "../overviewType";
import { RANGES, calloutPosition, extremes, rangeOptionValue, scaleFor, toChartData } from "./trendChart";

/** Renders the trend, marking the peak and trough of the series. */
function TrendChart({ title, range, series }: TrendPanel) {
    const chartData = toChartData(series);
    const scale = scaleFor(series.map(({ value }) => value));
    const { highest, lowest } = extremes(chartData);

    const callouts = [
        { label: "High ", tone: "text-success", point: highest },
        { label: "Low ", tone: "text-content-muted", point: lowest },
    ];

    return (
        <>
            <div className="w-full flex items-center justify-between">
                <Heading>{title}</Heading>
                <div className="w-[100px]">
                    <SelectField
                        className="rounded-[10px] h-7! px-2.5 py-1.5 text-sm"
                        defaultValue={rangeOptionValue(range)}
                        options={RANGES}
                    />
                </div>
            </div>
            <div className="relative h-[180px] w-full sm:h-[190px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 8, right: 0, bottom: 0, left: -12 }}>
                        <XAxis
                            dataKey="index"
                            type="number"
                            domain={[0, chartData.length - 1]}
                            ticks={chartData.map(({ index }) => index)}
                            tickFormatter={(index) => series[index]?.month ?? ""}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "var(--content-muted)", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            domain={[scale.from, scale.to]}
                            ticks={scale.ticks}
                            tickFormatter={(value) => formatNumber(value)}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "var(--content-muted)", fontSize: 12 }}
                            width={48}
                        />
                        <Area type="linear" dataKey="value" stroke="none" fill="var(--background)" baseValue={scale.from} isAnimationActive={false} />
                        <Line type="linear" dataKey="value" stroke="var(--primary)" strokeWidth={1.25} strokeDasharray="2 2" dot={false} activeDot={false} isAnimationActive={false} />
                        <ReferenceDot x={highest.index} y={highest.value} r={3.5} fill="var(--success)" stroke="var(--foreground)" />
                        <ReferenceDot x={lowest.index} y={lowest.value} r={3.5} fill="var(--content-muted)" stroke="var(--foreground)" />
                    </ComposedChart>
                </ResponsiveContainer>

                {callouts.map(({ label, tone, point }) => (
                    <div
                        key={label}
                        style={calloutPosition(point, chartData.length, scale)}
                        className="pointer-events-none absolute z-10 hidden -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-xs text-foreground shadow-sm sm:block"
                    >
                        {label}
                        <span className={tone}>{formatNumber(point.value)}</span>
                    </div>
                ))}
            </div>
        </>
    );
}

interface ActionTrendProps {
    /** `actionTrends` section of the Overview response. */
    panel?: TrendPanel;
    /** True while the Overview request is in flight. */
    isLoading?: boolean;
}

export default function ActionTrend({ panel, isLoading = false }: ActionTrendProps) {
    if (isLoading) {
        return (
            <AppSection>
                <Skeleton className="h-56 w-full" />
            </AppSection>
        );
    }

    if (!panel || panel.series.length === 0) {
        return (
            <AppSection>
                <p className="flex h-[180px] w-full items-center justify-center text-sm text-content-muted">
                    No action trend data for this range.
                </p>
            </AppSection>
        );
    }

    return (
        <AppSection>
            <TrendChart {...panel} />
        </AppSection>
    );
}
