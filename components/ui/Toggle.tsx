import { cn } from '@/lib/utils';

interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label?: string;
    className?: string;
}

export function Toggle({ enabled, onChange, label, className }: ToggleProps) {
    return (
        <label className={cn('inline-flex items-center cursor-pointer', className)}>
            <div className="relative">
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only"
                />
                <div
                    className={cn(
                        'w-11 h-6 rounded-full transition-colors duration-200',
                        enabled ? 'bg-primary' : 'bg-muted'
                    )}
                />
                <div
                    className={cn(
                        'absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200',
                        enabled && 'translate-x-5'
                    )}
                />
            </div>
            {label && (
                <span className="ml-3 text-sm text-foreground">{label}</span>
            )}
        </label>
    );
}
