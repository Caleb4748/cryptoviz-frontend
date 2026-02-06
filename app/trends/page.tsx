'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { fetchTrendsTop } from '@/lib/api';
import { TrendsResponse } from '@/types/api';
import { Card, CardHeader, CardTitle, CardContent, Button, SkeletonChart, SkeletonCard } from '@/components/ui';
import { TrendingCoinCard } from '@/components/dashboard';
import { TrendsChart } from '@/components/charts';

type MetricType = 'mentions' | 'priceChange';

export default function TrendsPage() {
    const [metric, setMetric] = useState<MetricType>('mentions');
    const [data, setData] = useState<TrendsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchTrendsTop(metric, '1h', 5);
            setData(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            toast.error('Erreur de chargement', { description: message });
        } finally {
            setIsLoading(false);
        }
    }, [metric]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Tendances du marché</h1>
                    <p className="text-muted-foreground">Top cryptomonnaies par mentions ou variation de prix</p>
                </div>
            </div>

            {/* Toggle Buttons */}
            <div className="flex gap-2">
                <Button
                    variant={metric === 'mentions' ? 'primary' : 'secondary'}
                    onClick={() => setMetric('mentions')}
                >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Vue par mentions
                </Button>
                <Button
                    variant={metric === 'priceChange' ? 'primary' : 'secondary'}
                    onClick={() => setMetric('priceChange')}
                >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Vue par prix
                </Button>
            </div>

            {/* Error State */}
            {error && (
                <Card className="border-red-500/50 bg-red-500/10">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <div className="flex-1">
                                <p className="text-red-400 font-medium">Impossible de charger les tendances</p>
                                <p className="text-sm text-red-400/70">{error}</p>
                            </div>
                            <Button onClick={loadData} variant="danger" size="sm">
                                Réessayer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart */}
                <div>
                    {isLoading ? (
                        <SkeletonChart />
                    ) : data && data.items.length > 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Top 5 par {metric === 'mentions' ? 'mentions' : 'variation de prix'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TrendsChart data={data.items} metric={metric} />
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Top 5</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-center justify-center text-muted-foreground">
                                    Aucune donnée disponible
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Trending Cards */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Trending Coins</h2>
                    {isLoading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : data && data.items.length > 0 ? (
                        data.items.map((item, index) => (
                            <TrendingCoinCard
                                key={item.symbol}
                                item={item}
                                metric={metric}
                                rank={index + 1}
                            />
                        ))
                    ) : (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                Aucune tendance disponible
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
