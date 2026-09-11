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

import AppCard from "@/components/design/AppCard";
import { SelectField } from "@/components/design/SelectField";

const chartData = [
    { month: 0, actions: 8900 },
    { month: 1, actions: 9000 },
    { month: 2, actions: 14500 },
    { month: 2.4, actions: 16200 },
    { month: 3, actions: 16800 },
    { month: 4, actions: 5900 },
    { month: 5, actions: 10500 },
    { month: 5.6, actions: 15800 },
    { month: 6, actions: 19800 },
];

const months = ["Jan", "Feb", "Mar", "April", "May", "June", "July"];

const callouts = [
    { label: "Low ", value: "8.9K", className: "left-[15%] top-[67%]", high: false },
    { label: "High ", value: "16K", className: "left-[34%] top-[24%]", high: true },
    { label: "Low ", value: "5.9K", className: "left-[59%] top-[68%]", high: false },
    { label: "High ", value: "15.8K", className: "left-[76%] top-[25%]", high: true },
];

export default function ActionTrend() {
    return (
        <AppCard
            shadow
            header="Action trends over time"
            headingSize="lg"
            actions={
                <div className="w-[100px]">
                    <SelectField
                        className="h-7 rounded-[10px] px-2 text-xs"
                        defaultValue="this-month"
                        options={[
                            { label: "This month", value: "this-month" },
                            { label: "Last month", value: "last-month" },
                            { label: "Last 90 days", value: "last-90-days" },
                        ]}
                    />
                </div>
            }
        >
            <div className="relative h-[180px] w-full sm:h-[190px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 8, right: 0, bottom: 0, left: -12 }}>
                        <defs>
                            <linearGradient id="action-trend-fill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.14} />
                                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.01} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="month" type="number" domain={[0, 6]} ticks={[0, 1, 2, 3, 4, 5, 6]} tickFormatter={(value) => months[value] ?? ""} axisLine={false} tickLine={false} tick={{ fill: "var(--gray)", fontSize: 12 }} dy={10} />
                        <YAxis domain={[5000, 20000]} ticks={[5000, 10000, 15000, 20000]} tickFormatter={(value) => `${value / 1000}K`} axisLine={false} tickLine={false} tick={{ fill: "var(--gray)", fontSize: 12 }} width={48} />
                        <ReferenceLine x={3} stroke="var(--border-strong)" strokeDasharray="2 2" />
                        <ReferenceLine x={5.2} stroke="var(--border-strong)" strokeDasharray="2 2" />
                        <Area type="linear" dataKey="actions" stroke="none" fill="url(#action-trend-fill)" baseValue={5000} isAnimationActive={false} />
                        <Line type="linear" dataKey="actions" stroke="var(--primary)" strokeWidth={1.25} strokeDasharray="2 2" dot={false} activeDot={false} isAnimationActive={false} />
                        <ReferenceDot x={0} y={8900} r={3.5} fill="var(--gray)" stroke="var(--foreground)" />
                        <ReferenceDot x={2.4} y={16200} r={3.5} fill="var(--success)" stroke="var(--foreground)" />
                        <ReferenceDot x={4} y={5900} r={3.5} fill="var(--gray)" stroke="var(--foreground)" />
                        <ReferenceDot x={5.6} y={15800} r={3.5} fill="var(--success)" stroke="var(--foreground)" />
                    </ComposedChart>
                </ResponsiveContainer>

                {callouts.map(({ label, value, className, high }) => (
                    <div key={value} className={`pointer-events-none absolute z-10 hidden -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-xs text-foreground shadow-sm sm:block ${className}`}>
                        {label}<span className={high ? "text-success" : "text-ghost"}>{value}</span>
                    </div>
                ))}
            </div>
        </AppCard>
    );
}
