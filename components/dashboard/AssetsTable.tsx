'use client';

import { ProcessedCryptoData } from '@/types/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { formatNumber, formatTimestamp, cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AssetsTableProps {
    assets: ProcessedCryptoData[];
    isLoading?: boolean;
}

export function AssetsTable({ assets, isLoading }: AssetsTableProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Cryptomonnaies en temps réel</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-muted rounded" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (assets.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Cryptomonnaies en temps réel</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        En attente de données...
                    </p>
                </CardContent>
            </Card>
        );
    }

    const getTrendIcon = (trend: 'up' | 'down') => {
        if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
        return <TrendingDown className="w-4 h-4 text-red-400" />;
    };

    const getTrendColor = (trend: 'up' | 'down') => {
        return trend === 'up' ? 'text-green-400' : 'text-red-400';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cryptomonnaies en temps réel</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                    ID
                                </th>
                                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                                    Prix actuel
                                </th>
                                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                                    Moyenne mobile
                                </th>
                                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground hidden md:table-cell">
                                    Volume 24h
                                </th>
                                <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                                    Tendance
                                </th>
                                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                                    Mise à jour
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
                                <tr key={asset.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                    <td className="py-3 px-2">
                                        <span className="font-bold text-foreground capitalize">{asset.id}</span>
                                    </td>
                                    <td className={cn("py-3 px-2 text-right font-semibold", getTrendColor(asset.trend))}>
                                        ${formatNumber(asset.current_price, 2)}
                                    </td>
                                    <td className="py-3 px-2 text-right text-muted-foreground">
                                        ${formatNumber(asset.moving_average, 2)}
                                    </td>
                                    <td className="py-3 px-2 text-right text-muted-foreground hidden md:table-cell">
                                        {asset.avg_volume_24h ? `$${formatNumber(asset.avg_volume_24h, 0)}` : '-'}
                                    </td>
                                    <td className="py-3 px-2">
                                        <div className="flex justify-center">
                                            {getTrendIcon(asset.trend)}
                                        </div>
                                    </td>
                                    <td className="py-3 px-2 text-right text-xs text-muted-foreground hidden lg:table-cell">
                                        {formatTimestamp(asset.timestamp)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
