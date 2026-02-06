import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                // Variants
                variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                variant === 'ghost' && 'bg-transparent hover:bg-muted text-foreground',
                variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600',
                // Sizes
                size === 'sm' && 'px-3 py-1.5 text-sm',
                size === 'md' && 'px-4 py-2 text-sm',
                size === 'lg' && 'px-6 py-3 text-base',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
