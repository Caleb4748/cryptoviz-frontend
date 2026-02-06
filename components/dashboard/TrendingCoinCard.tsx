import { TrendItem } from '@/types/api';
import { Card } from '@/components/ui';
import { formatCompactNumber, cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendingCoinCardProps {
    item: TrendItem;
    metric: 'mentions' | 'priceChange';
    rank: number;
}

export function TrendingCoinCard({ item, metric, rank }: TrendingCoinCardProps) {
    const isPositive = (item.changePct ?? 0) >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    if (item.changePct === 0 || item.changePct === undefined) {
        // Stable
    }

    return (
        <Card className="hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-white font-bold text-sm">#{rank}</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-lg">{item.symbol}</span>
                        {item.changePct !== undefined && (
                            <span
                                className={cn(
                                    'flex items-center gap-1 text-sm',
                                    isPositive ? 'text-green-400' : 'text-red-400'
                                )}
                            >
                                <TrendIcon className="w-4 h-4" />
                                {Math.abs(item.changePct).toFixed(2)}%
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {metric === 'mentions'
                            ? `${formatCompactNumber(item.value)} mentions`
                            : `${item.value >= 0 ? '+' : ''}${item.value.toFixed(2)}%`}
                    </p>
                </div>
            </div>
        </Card>
    );
}
