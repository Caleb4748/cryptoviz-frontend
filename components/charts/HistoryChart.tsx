'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { TimeSeriesPoint } from '@/types/api';
import { formatCompactNumber } from '@/lib/utils';

interface HistoryChartProps {
    data: TimeSeriesPoint[];
}

export function HistoryChart({ data }: HistoryChartProps) {
    const chartData = data.map((point) => {
        const date = new Date(point.t);
        return {
            date: `${date.getDate()}/${date.getMonth() + 1}`,
            value: point.value,
            fullDate: point.t,
        };
    });

    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 15%)" />
                <XAxis
                    dataKey="date"
                    stroke="hsl(215, 20%, 55%)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(217, 33%, 15%)' }}
                />
                <YAxis
                    stroke="hsl(215, 20%, 55%)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(217, 33%, 15%)' }}
                    tickFormatter={(value) => formatCompactNumber(value)}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 8%)',
                        border: '1px solid hsl(217, 33%, 15%)',
                        borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
                    formatter={(value) => [formatCompactNumber(Number(value)), 'Volume']}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(262, 83%, 58%)"
                    strokeWidth={2}
                    fill="url(#historyGradient)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
