'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, MessageSquare, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { TrendsResponse, TrendItem } from '@/types/api';
import { formatCompactNumber } from '@/lib/utils'; // Assuming this utility exists

interface TrendingWidgetProps {
    mentionsData?: TrendsResponse | null;
    priceData?: TrendsResponse | null;
    isLoading: boolean;
}

export function TrendingWidget({ mentionsData, priceData, isLoading }: TrendingWidgetProps) {
    const [activeTab, setActiveTab] = useState<'mentions' | 'price'>('mentions');

    const data = activeTab === 'mentions' ? mentionsData : priceData;
    const items = data?.items || [];
    const metricLabel = activeTab === 'mentions' ? 'Mentions' : 'Variation';

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        {activeTab === 'mentions' ? (
                            <MessageSquare className="w-5 h-5 text-primary" />
                        ) : (
                            <TrendingUp className="w-5 h-5 text-accent" />
                        )}
                        Tendances
                    </CardTitle>
                    <div className="flex bg-muted/50 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('mentions')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'mentions'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Mentions
                        </button>
                        <button
                            onClick={() => setActiveTab('price')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'price'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Prix
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 w-full bg-muted/50 animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : items.length > 0 ? (
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={item.symbol} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors group">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-muted-foreground w-4">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="font-bold text-sm tracking-tight">{item.symbol}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {activeTab === 'mentions' ? 'Vol. Social' : '24h Change'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm">
                                        {activeTab === 'mentions'
                                            ? formatCompactNumber(item.value) // Using raw value for mentions
                                            : `${item.value > 0 ? '+' : ''}${item.value.toFixed(2)}%`
                                        }
                                    </p>
                                    {activeTab === 'price' && (
                                        <div className={`flex items-center text-xs ${item.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {item.value >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                            {item.value >= 0 ? 'Hausse' : 'Baisse'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                        Aucune tendance disponible
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
