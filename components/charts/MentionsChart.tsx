'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { TimeSeriesPoint } from '@/types/api';
import { formatTime } from '@/lib/utils';

interface MentionsChartProps {
    data: TimeSeriesPoint[];
}

export function MentionsChart({ data }: MentionsChartProps) {
    const chartData = data.map((point) => ({
        time: formatTime(point.t),
        value: point.value,
        fullTime: point.t,
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <defs>
                    <linearGradient id="mentionsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 15%)" />
                <XAxis
                    dataKey="time"
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
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 8%)',
                        border: '1px solid hsl(217, 33%, 15%)',
                        borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
                    itemStyle={{ color: 'hsl(221, 83%, 53%)' }}
                />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(221, 83%, 53%)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: 'hsl(221, 83%, 53%)' }}
                    fill="url(#mentionsGradient)"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
