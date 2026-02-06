'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ProcessedCryptoData } from '@/types/api';
import { fetchCryptos } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface UseWebSocketOptions {
    enabled?: boolean;
    pollingIntervalMs?: number;
}

interface UseWebSocketResult {
    data: ProcessedCryptoData[];
    isConnected: boolean;
    error: string | null;
}

export function useWebSocket({
    enabled = true,
    pollingIntervalMs = 5000,
}: UseWebSocketOptions = {}): UseWebSocketResult {
    const [data, setData] = useState<ProcessedCryptoData[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    // Fallback polling function
    const pollData = useCallback(async () => {
        try {
            const cryptos = await fetchCryptos();
            setData(cryptos);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Polling error');
        }
    }, []);

    // Start polling fallback
    const startPolling = useCallback(() => {
        if (pollingRef.current) return;

        pollData(); // Initial fetch
        pollingRef.current = setInterval(pollData, pollingIntervalMs);
    }, [pollData, pollingIntervalMs]);

    // Stop polling
    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!enabled) return;

        // Try WebSocket connection
        const wsUrl = API_BASE_URL.replace(/^http/, 'ws') + '/ws';

        try {
            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
                setIsConnected(true);
                setError(null);
                stopPolling();
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const cryptoData: ProcessedCryptoData = JSON.parse(event.data);
                    setData(prev => {
                        const index = prev.findIndex(c => c.symbol === cryptoData.symbol);
                        if (index >= 0) {
                            const updated = [...prev];
                            updated[index] = cryptoData;
                            return updated;
                        }
                        return [...prev, cryptoData];
                    });
                } catch {
                    console.error('Failed to parse WebSocket message');
                }
            };

            wsRef.current.onerror = () => {
                setError('WebSocket connection failed, falling back to polling');
                setIsConnected(false);
                startPolling();
            };

            wsRef.current.onclose = () => {
                setIsConnected(false);
                startPolling();
            };
        } catch {
            // WebSocket not supported or failed, use polling
            setError('WebSocket not available, using polling');
            startPolling();
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            stopPolling();
        };
    }, [enabled, startPolling, stopPolling]);

    return { data, isConnected, error };
}
