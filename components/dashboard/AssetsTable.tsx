'use client';

import { ProcessedCryptoData } from '@/types/api';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { formatNumber, formatDate, cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AssetsTableProps {
    assets: ProcessedCryptoData[];
    isLoading?: boolean;
}

export function AssetsTable({ assets, isLoading }: AssetsTableProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Assets Crypto</CardTitle>
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
                    <CardTitle>Assets Crypto</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        Aucune donnée disponible
                    </p>
                </CardContent>
            </Card>
        );
    }

    const getTrendIcon = (trend?: string) => {
        if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
        if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Assets Crypto</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                    Symbol
                                </th>
                                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                                    Prix
                                </th>
                                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                                    MA
                                </th>
                                <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                                    Tendance
                                </th>
                                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                                    Mise à jour
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
                                <tr key={asset.symbol} className="border-b border-border/50 hover:bg-muted/30">
                                    <td className="py-3 px-2">
                                        <span className="font-bold text-foreground">{asset.symbol}</span>
                                    </td>
                                    <td className="py-3 px-2 text-right text-foreground">
                                        ${formatNumber(asset.price, 2)}
                                    </td>
                                    <td className="py-3 px-2 text-right text-muted-foreground">
                                        {asset.moving_avg ? `$${formatNumber(asset.moving_avg, 2)}` : '-'}
                                    </td>
                                    <td className="py-3 px-2">
                                        <div className="flex justify-center">
                                            {getTrendIcon(asset.trend)}
                                        </div>
                                    </td>
                                    <td className="py-3 px-2 text-right text-xs text-muted-foreground">
                                        {formatDate(asset.updated_at)}
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
