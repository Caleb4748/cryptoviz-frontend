'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { SmilePlus, Meh, Frown, AlertTriangle } from 'lucide-react';
import { fetchSentimentSummary } from '@/lib/api';
import { SentimentSummary } from '@/types/api';
import { Card, CardHeader, CardTitle, CardContent, Select, SkeletonChart, SkeletonCard } from '@/components/ui';
import { SentimentChart } from '@/components/charts';

const WINDOW_OPTIONS = [
    { value: '15m', label: '15 minutes' },
    { value: '1h', label: '1 heure' },
    { value: '24h', label: '24 heures' },
];

export default function SentimentPage() {
    const [window, setWindow] = useState('1h');
    const [data, setData] = useState<SentimentSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchSentimentSummary(window);
            setData(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur inconnue';
            setError(message);
            toast.error('Erreur de chargement', { description: message });
        } finally {
            setIsLoading(false);
        }
    }, [window]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Sentiment des actualités</h1>
                    <p className="text-muted-foreground">Analyse du sentiment global des actualités crypto</p>
                </div>
                <Select
                    options={WINDOW_OPTIONS}
                    value={window}
                    onChange={setWindow}
                />
            </div>

            {/* Error State */}
            {error && (
                <Card className="border-red-500/50 bg-red-500/10">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <div className="flex-1">
                                <p className="text-red-400 font-medium">Impossible de charger le sentiment</p>
                                <p className="text-sm text-red-400/70">{error}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donut Chart */}
                <div>
                    {isLoading ? (
                        <SkeletonChart />
                    ) : data ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Répartition du sentiment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SentimentChart data={data} />
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Répartition du sentiment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-center justify-center text-muted-foreground">
                                    Aucune donnée disponible
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sentiment Cards */}
                <div className="space-y-4">
                    {isLoading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : data ? (
                        <>
                            <Card className="border-green-500/30 bg-green-500/5">
                                <CardContent className="py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-green-500/20">
                                            <SmilePlus className="w-6 h-6 text-green-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Positif</p>
                                            <p className="text-3xl font-bold text-green-400">{data.positivePct}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-yellow-500/30 bg-yellow-500/5">
                                <CardContent className="py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-yellow-500/20">
                                            <Meh className="w-6 h-6 text-yellow-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Neutre</p>
                                            <p className="text-3xl font-bold text-yellow-400">{data.neutralPct}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-red-500/30 bg-red-500/5">
                                <CardContent className="py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-red-500/20">
                                            <Frown className="w-6 h-6 text-red-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Négatif</p>
                                            <p className="text-3xl font-bold text-red-400">{data.negativePct}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {data.totalItems !== undefined && (
                                <Card>
                                    <CardContent className="py-4 text-center">
                                        <p className="text-sm text-muted-foreground">Total d&apos;articles analysés</p>
                                        <p className="text-2xl font-bold text-foreground">{data.totalItems}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    ) : (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                Aucune donnée disponible
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
