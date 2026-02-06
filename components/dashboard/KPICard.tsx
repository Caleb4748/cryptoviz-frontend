import { Card } from '@/components/ui';
import { Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'stable';
    isLoading?: boolean;
}

export function KPICard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    isLoading,
}: KPICardProps) {
    if (isLoading) {
        return (
            <Card>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-8 w-32 mb-1" />
                        {subtitle && <Skeleton className="h-3 w-20" />}
                    </div>
                    <Skeleton className="h-12 w-12 rounded-lg" />
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted-foreground mb-1">{title}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    {subtitle && (
                        <p
                            className={cn(
                                'text-xs mt-1',
                                trend === 'up' && 'text-green-400',
                                trend === 'down' && 'text-red-400',
                                (!trend || trend === 'stable') && 'text-muted-foreground'
                            )}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
            </div>
        </Card>
    );
}
