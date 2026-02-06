'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui';

export function Header() {
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}:${seconds}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="fixed top-0 right-0 left-64 z-30 h-16 bg-header border-b border-border">
            <div className="flex items-center justify-between h-full px-6">
                {/* Search Bar */}
                <div className="relative max-w-md flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Clock */}
                    <div className="text-sm font-mono text-muted-foreground">
                        {currentTime}
                    </div>

                    {/* Status Badge */}
                    <Badge variant="online">En ligne</Badge>
                </div>
            </div>
        </header>
    );
}
