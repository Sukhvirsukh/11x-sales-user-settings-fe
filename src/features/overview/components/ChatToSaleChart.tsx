import {
    Area,
    ComposedChart,
    Line,
    ReferenceDot,
    ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

import Heading from "@/components/design/Heading";
import { SelectField } from "@/components/design/SelectField";
import AppSection from "@/components/design/AppSectoin";

const chartData = [
    4800, 11100, 19800, 8700, 11900, 10800, 9000, 12400, 14300, 9800,
    13200, 12300, 13200, 10600, 13800, 11400, 11300, 9200, 11600, 9000,
    13100, 8800, 10200, 11700, 11700, 10500, 13700, 11700, 14400, 11800,
    12200, 10200, 9400, 11700, 10100,
].map((sales, day) => ({ day, sales }));

const monthTicks = [
    { day: 0, label: "Jan" }, { day: 6, label: "Feb" }, { day: 11, label: "Mar" },
    { day: 17, label: "April" }, { day: 22, label: "May" }, { day: 28, label: "June" },
    { day: 33, label: "July" },
];

const CALLOUTS = [
    { label: "High ", value: "19.8K", className: "left-[11%] top-1" },
    { label: "Low ", value: "8.9K", className: "left-[25%] top-[58%]" },
    { label: "High ", value: "14.2K", className: "left-[46%] top-[31%]" },
    { label: "Low ", value: "8.2K", className: "left-[56%] top-[66%]" },
];

export default function ChatToSaleChart() {
    return (
        <AppSection className="h-auto">
            <div className="w-full">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <Heading size="lg">Total Chat-to-Sale conversion</Heading>
                    <div className="">
                        <SelectField
                            className="h-7 "
                            defaultValue="this-month"
                            options={[
                                { label: "This month", value: "this-month" },
                                { label: "Last month", value: "last-month" },
                                { label: "Last 90 days", value: "last-90-days" },
                            ]}
                        />
                    </div>
                </div>

                <div className="relative h-45 w-full sm:h-47.5">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 8, right: 10, bottom: 0, left: -12 }}>
                            <XAxis dataKey="day" type="number" domain={[0, 34]} ticks={monthTicks.map(({ day }) => day)} tickFormatter={(day) => monthTicks.find((tick) => tick.day === day)?.label ?? ""} axisLine={false} tickLine={false} tick={{ fill: "var(--chart-axis)", fontSize: 12 }} dy={10} />
                            <YAxis domain={[5000, 20000]} ticks={[5000, 10000, 15000, 20000]} tickFormatter={(value) => `${value / 1000}K`} axisLine={false} tickLine={false} tick={{ fill: "var(--chart-axis)", fontSize: 12 }} width={48} />
                            <ReferenceLine x={13} stroke="var(--chart-grid)" strokeDasharray="2 2" />
                            <ReferenceLine x={28} stroke="var(--chart-grid)" strokeDasharray="2 2" />
                            <Area type="linear" dataKey="sales" stroke="none" fill="var(--surface-raised)" baseValue={5000} isAnimationActive={false} />
                            <Line type="linear" dataKey="sales" stroke="var(--primary)" strokeWidth={1.25} dot={false} activeDot={false} isAnimationActive={false} />
                            <ReferenceDot x={2} y={19800} r={3.5} fill="var(--chart-high-marker)" stroke="var(--chart-marker-border)" />
                            <ReferenceDot x={10} y={9800} r={3.5} fill="var(--chart-low-marker)" stroke="var(--chart-marker-border)" />
                            <ReferenceDot x={15} y={13800} r={3.5} fill="var(--chart-high-marker)" stroke="var(--chart-marker-border)" />
                            <ReferenceDot x={22} y={8800} r={3.5} fill="var(--chart-low-marker)" stroke="var(--chart-marker-border)" />
                        </ComposedChart>
                    </ResponsiveContainer>

                    {CALLOUTS.map(({ label, value, className }) => (
                        <div key={value} className={`pointer-events-none absolute z-10 hidden -translate-y-1/2 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-xs text-zinc-800 shadow-sm dark:border-border dark:bg-popover dark:text-content-strong sm:block ${className}`}>
                            {label}<span className={label === "High " ? "text-green-700 dark:text-success" : "text-zinc-600 dark:text-content-muted"}>{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </AppSection>
    );
}
