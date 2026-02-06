'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoRefreshOptions<T> {
    fetchFn: () => Promise<T>;
    intervalMs: number;
    enabled?: boolean;
}

interface UseAutoRefreshResult<T> {
    data: T | null;
    error: string | null;
    isLoading: boolean;
    refresh: () => void;
}

export function useAutoRefresh<T>({
    fetchFn,
    intervalMs,
    enabled = true,
}: UseAutoRefreshOptions<T>): UseAutoRefreshResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [fetchFn]);

    const refresh = useCallback(() => {
        setIsLoading(true);
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (!enabled) return;

        // Initial fetch
        fetchData();

        // Set up interval
        intervalRef.current = setInterval(fetchData, intervalMs);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchData, intervalMs, enabled]);

    return { data, error, isLoading, refresh };
}
