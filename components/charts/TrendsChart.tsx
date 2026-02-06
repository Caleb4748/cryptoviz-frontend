'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { TrendItem } from '@/types/api';
import { formatCompactNumber } from '@/lib/utils';

interface TrendsChartProps {
    data: TrendItem[];
    metric: 'mentions' | 'priceChange';
}

const COLORS = [
    'hsl(221, 83%, 53%)',
    'hsl(262, 83%, 58%)',
    'hsl(142, 71%, 45%)',
    'hsl(48, 96%, 53%)',
    'hsl(0, 84%, 60%)',
];

export function TrendsChart({ data, metric }: TrendsChartProps) {
    const chartData = data.map((item) => ({
        symbol: item.symbol,
        value: item.value,
        changePct: item.changePct,
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 15%)" horizontal={false} />
                <XAxis
                    type="number"
                    stroke="hsl(215, 20%, 55%)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(217, 33%, 15%)' }}
                    tickFormatter={(value) => formatCompactNumber(value)}
                />
                <YAxis
                    type="category"
                    dataKey="symbol"
                    stroke="hsl(215, 20%, 55%)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(217, 33%, 15%)' }}
                    width={60}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 8%)',
                        border: '1px solid hsl(217, 33%, 15%)',
                        borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
                    formatter={(value) => [
                        metric === 'priceChange' ? `${Number(value).toFixed(2)}%` : formatCompactNumber(Number(value)),
                        metric === 'mentions' ? 'Mentions' : 'Variation',
                    ]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
