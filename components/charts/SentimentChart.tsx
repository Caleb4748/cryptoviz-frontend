'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SentimentSummary } from '@/types/api';

interface SentimentChartProps {
    data: SentimentSummary;
}

const COLORS = {
    positive: 'hsl(142, 71%, 45%)',
    neutral: 'hsl(48, 96%, 53%)',
    negative: 'hsl(0, 84%, 60%)',
};

export function SentimentChart({ data }: SentimentChartProps) {
    const chartData = [
        { name: 'Positif', value: data.positivePct, color: COLORS.positive },
        { name: 'Neutre', value: data.neutralPct, color: COLORS.neutral },
        { name: 'Négatif', value: data.negativePct, color: COLORS.negative },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 8%)',
                        border: '1px solid hsl(217, 33%, 15%)',
                        borderRadius: '8px',
                    }}
                    formatter={(value) => [`${value}%`, '']}
                />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                        <span style={{ color: 'hsl(215, 20%, 55%)' }}>{value}</span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
