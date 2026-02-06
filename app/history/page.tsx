'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Download, AlertTriangle, BarChart3, Clock, Database } from 'lucide-react';
import { fetchHistory } from '@/lib/api';
import { HistoryResponse } from '@/types/api';
import { exportCSV, exportJSON, calculateAverage, findPeakHour, formatCompactNumber } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, Select, Button, SkeletonChart, SkeletonCard } from '@/components/ui';
import { HistoryChart } from '@/components/charts';

type MetricType = 'newsVolume' | 'mentionsVolume';

const METRIC_OPTIONS = [
    { value: 'newsVolume', label: 'Volume d\'actualités' },
    { value: 'mentionsVolume', label: 'Volume de mentions' },
];

export default function HistoryPage() {
    const [metric, setMetric] = useState<MetricType>('newsVolume');
    const [data, setData] = useState<HistoryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchHistory(metric, '30d', '1d');
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

    const handleExportCSV = () => {
        if (data?.points) {
            exportCSV(data.points, `cryptoviz-${metric}-export.csv`);
            toast.success('Export CSV téléchargé');
        }
    };

    const handleExportJSON = () => {
        if (data?.points) {
            exportJSON(data.points, `cryptoviz-${metric}-export.json`);
            toast.success('Export JSON téléchargé');
        }
    };

    // Calculate derived KPIs
    const avgVolume = data?.points ? calculateAverage(data.points) : 0;
    const peakHour = data?.points ? findPeakHour(data.points) : 'N/A';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Historique analytique</h1>
                    <p className="text-muted-foreground">Données historiques sur 30 jours</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select
                        options={METRIC_OPTIONS}
                        value={metric}
                        onChange={(v) => setMetric(v as MetricType)}
                    />
                    <Button onClick={handleExportCSV} variant="secondary" size="sm" disabled={!data?.points?.length}>
                        <Download className="w-4 h-4 mr-2" />
                        CSV
                    </Button>
                    <Button onClick={handleExportJSON} variant="secondary" size="sm" disabled={!data?.points?.length}>
                        <Download className="w-4 h-4 mr-2" />
                        JSON
                    </Button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <Card className="border-red-500/50 bg-red-500/10">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <div className="flex-1">
                                <p className="text-red-400 font-medium">Impossible de charger l&apos;historique</p>
                                <p className="text-sm text-red-400/70">{error}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Chart */}
            {isLoading ? (
                <SkeletonChart />
            ) : data && data.points.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {metric === 'newsVolume' ? 'Volume d\'actualités' : 'Volume de mentions'} - 30 derniers jours
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <HistoryChart data={data.points} />
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Historique</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                            Aucune donnée disponible
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isLoading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : (
                    <>
                        <Card>
                            <CardContent className="py-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <BarChart3 className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Volume quotidien moyen</p>
                                        <p className="text-2xl font-bold text-foreground">
                                            {data?.points?.length ? formatCompactNumber(avgVolume) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="py-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-accent/10">
                                        <Clock className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Heure d&apos;activité maximale</p>
                                        <p className="text-2xl font-bold text-foreground">{peakHour}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="py-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-green-500/10">
                                        <Database className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Rétention des données</p>
                                        <p className="text-2xl font-bold text-foreground">90 jours</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}
