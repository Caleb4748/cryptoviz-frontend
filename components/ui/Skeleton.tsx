import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-lg bg-muted',
                className
            )}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-card rounded-xl border border-border p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="bg-card rounded-xl border border-border p-6">
            <Skeleton className="h-5 w-48 mb-4" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
}

export function SkeletonList() {
    return (
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <Skeleton className="h-5 w-40 mb-4" />
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}
