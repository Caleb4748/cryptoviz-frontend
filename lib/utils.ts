import { TimeSeriesPoint } from '@/types/api';

/**
 * Format a date string to French readable format: "06 fév. 2026 — 01:03:35"
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day} ${month} ${year} — ${hours}:${minutes}:${seconds}`;
}

/**
 * Format a Unix timestamp (seconds) to French readable format
 */
export function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);

    const day = date.getDate().toString().padStart(2, '0');
    const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day} ${month} ${year} — ${hours}:${minutes}:${seconds}`;
}

/**
 * Format a date string to time only: "01:03:35"
 */
export function formatTime(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format a number with locale separators
 */
export function formatNumber(num: number | undefined | null, decimals: number = 0): string {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

/**
 * Format large numbers with abbreviations (1.2M, 3.4K, etc.)
 */
export function formatCompactNumber(num: number): string {
    if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(1)}B`;
    }
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toString();
}

/**
 * Merge class names utility
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

/**
 * Export data as CSV file
 */
export function exportCSV(data: TimeSeriesPoint[], filename: string = 'export.csv'): void {
    const headers = ['timestamp', 'value'];
    const csvContent = [
        headers.join(','),
        ...data.map(point => `${point.t},${point.value}`)
    ].join('\n');

    downloadFile(csvContent, filename, 'text/csv');
}

/**
 * Export data as JSON file
 */
export function exportJSON(data: TimeSeriesPoint[], filename: string = 'export.json'): void {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename, 'application/json');
}

/**
 * Download a file with given content
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Calculate average from timeseries points
 */
export function calculateAverage(points: TimeSeriesPoint[]): number {
    if (points.length === 0) return 0;
    const sum = points.reduce((acc, point) => acc + point.value, 0);
    return sum / points.length;
}

/**
 * Find peak hour from timeseries data
 */
export function findPeakHour(points: TimeSeriesPoint[]): string {
    if (points.length === 0) return 'N/A';

    const maxPoint = points.reduce((max, point) =>
        point.value > max.value ? point : max
        , points[0]);

    const date = new Date(maxPoint.t);
    return `${date.getHours().toString().padStart(2, '0')}:00`;
}
