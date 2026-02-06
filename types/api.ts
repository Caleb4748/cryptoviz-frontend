// API Response Types based on swagger.yaml

export interface HealthResponse {
    status: string;
    uptime_seconds?: number;
}

export interface OverviewResponse {
    activeStreams: number;
    lastUpdate: string;
    avgLatencyMs: number;
    dataPointsCollected: number;
}

export interface TimeSeriesPoint {
    t: string;
    value: number;
}

export interface TimeSeriesResponse {
    window?: string;
    interval?: string;
    points: TimeSeriesPoint[];
}

export interface RecentEvent {
    symbol: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    title: string;
    source: string;
    publishedAt: string;
}

export interface RecentEventsResponse {
    items: RecentEvent[];
}

export interface TrendItem {
    symbol: string;
    value: number;
    changePct?: number;
}

export interface TrendsResponse {
    metric: 'mentions' | 'priceChange';
    window?: string;
    items: TrendItem[];
}

export interface SentimentSummary {
    window?: string;
    positivePct: number;
    neutralPct: number;
    negativePct: number;
    totalItems?: number;
}

export interface HistoryResponse {
    metric: 'newsVolume' | 'mentionsVolume';
    range?: string;
    interval?: string;
    points: TimeSeriesPoint[];
}

export interface ProcessedCryptoData {
    symbol: string;
    price: number;
    market_cap?: number;
    volume_24h?: number;
    moving_avg?: number;
    trend?: 'up' | 'down' | 'stable';
    updated_at: string;
}

// API Error type
export interface ApiError {
    message: string;
    status?: number;
}
