'use client';

import { RecentEvent } from '@/types/api';
import { Badge, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { SkeletonList } from '@/components/ui';
import { formatDate } from '@/lib/utils';

interface EventsListProps {
    events: RecentEvent[];
    isLoading?: boolean;
}

export function EventsList({ events, isLoading }: EventsListProps) {
    if (isLoading) {
        return <SkeletonList />;
    }

    if (events.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Événements récents</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        Aucun événement récent
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Événements récents</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                        >
                            <div className="flex-shrink-0">
                                <Badge
                                    variant={
                                        event.sentiment === 'positive'
                                            ? 'positive'
                                            : event.sentiment === 'negative'
                                                ? 'negative'
                                                : 'neutral'
                                    }
                                    size="sm"
                                >
                                    {event.symbol}
                                </Badge>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground font-medium truncate">
                                    {event.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                        {event.source}
                                    </span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(event.publishedAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
