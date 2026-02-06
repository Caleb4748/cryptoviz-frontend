import {
    HealthResponse,
    ProcessedCryptoData,
    OverviewResponse,
    TimeSeriesResponse,
    RecentEventsResponse,
    TrendsResponse,
    SentimentSummary,
    HistoryResponse,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://137.184.116.222:8000';

class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

async function fetchWithErrorHandling<T>(endpoint: string): Promise<T> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);

        if (!response.ok) {
            throw new ApiError(
                `API Error: ${response.statusText}`,
                response.status
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            error instanceof Error ? error.message : 'Network error',
            0
        );
    }
}

// System
export async function fetchHealth(): Promise<HealthResponse> {
    return fetchWithErrorHandling<HealthResponse>('/health');
}

// Assets
export async function fetchCryptos(): Promise<ProcessedCryptoData[]> {
    return fetchWithErrorHandling<ProcessedCryptoData[]>('/cryptos');
}

// Legacy Stubs - kept for compatibility with hidden pages
// All return empty data or error to indicate feature is disabled

export async function fetchOverview(): Promise<OverviewResponse> {
    throw new Error('Feature disabled');
}

export async function fetchMentionsTimeseries(
    window: string = '60m',
    interval: string = '1m'
): Promise<TimeSeriesResponse> {
    return { points: [] };
}

export async function fetchRecentEvents(limit: number = 20): Promise<RecentEventsResponse> {
    return { items: [] };
}

export async function fetchTrendsTop(
    metric: 'mentions' | 'priceChange',
    window: string = '1h',
    limit: number = 5
): Promise<TrendsResponse> {
    return { metric, items: [] };
}

export async function fetchSentimentSummary(window: string = '1h'): Promise<SentimentSummary> {
    return {
        positivePct: 0,
        neutralPct: 0,
        negativePct: 0,
        totalItems: 0
    };
}

export async function fetchHistory(
    metric: 'newsVolume' | 'mentionsVolume' = 'newsVolume',
    range: string = '30d',
    interval: string = '1d'
): Promise<HistoryResponse> {
    return { metric, points: [] };
}

export { ApiError };
