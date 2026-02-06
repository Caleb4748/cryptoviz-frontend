import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
    variant?: 'default' | 'positive' | 'neutral' | 'negative' | 'online' | 'offline';
    size?: 'sm' | 'md';
    children: ReactNode;
    className?: string;
}

export function Badge({
    variant = 'default',
    size = 'md',
    children,
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-full',
                // Sizes
                size === 'sm' && 'px-2 py-0.5 text-xs',
                size === 'md' && 'px-2.5 py-1 text-xs',
                // Variants
                variant === 'default' && 'bg-muted text-muted-foreground',
                variant === 'positive' && 'bg-green-500/20 text-green-400',
                variant === 'neutral' && 'bg-yellow-500/20 text-yellow-400',
                variant === 'negative' && 'bg-red-500/20 text-red-400',
                variant === 'online' && 'bg-green-500/20 text-green-400',
                variant === 'offline' && 'bg-red-500/20 text-red-400',
                className
            )}
        >
            {(variant === 'online' || variant === 'offline') && (
                <span
                    className={cn(
                        'w-2 h-2 rounded-full mr-1.5',
                        variant === 'online' && 'bg-green-400 animate-pulse',
                        variant === 'offline' && 'bg-red-400'
                    )}
                />
            )}
            {children}
        </span>
    );
}
