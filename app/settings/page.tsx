'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Save, Moon, Sun, Server, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { fetchHealth } from '@/lib/api';
import { HealthResponse } from '@/types/api';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Toggle } from '@/components/ui';

export default function SettingsPage() {
    // Settings state (persisted in localStorage)
    const [kafkaTopic, setKafkaTopic] = useState('crypto-events');
    const [refreshRate, setRefreshRate] = useState(2000);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Health check state
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [healthLoading, setHealthLoading] = useState(true);
    const [healthError, setHealthError] = useState<string | null>(null);

    // Load settings from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('cryptoviz-settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setKafkaTopic(parsed.kafkaTopic || 'crypto-events');
                setRefreshRate(parsed.refreshRate || 2000);
            } catch {
                // Ignore parse errors
            }
        }

        const theme = localStorage.getItem('theme');
        setIsDarkMode(theme !== 'light');
    }, []);

    // Check health on mount
    const checkHealth = useCallback(async () => {
        setHealthLoading(true);
        setHealthError(null);
        try {
            const result = await fetchHealth();
            setHealth(result);
        } catch (err) {
            setHealthError(err instanceof Error ? err.message : 'Erreur de connexion');
        } finally {
            setHealthLoading(false);
        }
    }, []);

    useEffect(() => {
        checkHealth();
    }, [checkHealth]);

    // Save settings handler
    const handleSave = () => {
        localStorage.setItem('cryptoviz-settings', JSON.stringify({
            kafkaTopic,
            refreshRate,
        }));
        toast.success('Configuration enregistrée', {
            description: 'Les paramètres ont été sauvegardés avec succès',
        });
    };

    // Dark mode toggle
    const handleThemeToggle = (enabled: boolean) => {
        setIsDarkMode(enabled);
        document.documentElement.classList.toggle('light', !enabled);
        localStorage.setItem('theme', enabled ? 'dark' : 'light');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
                <p className="text-muted-foreground">Configuration du dashboard et état du système</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Nom du topic Kafka
                            </label>
                            <input
                                type="text"
                                value={kafkaTopic}
                                onChange={(e) => setKafkaTopic(e.target.value)}
                                className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Topic Kafka pour les événements crypto
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Taux de rafraîchissement (ms)
                            </label>
                            <input
                                type="number"
                                value={refreshRate}
                                onChange={(e) => setRefreshRate(parseInt(e.target.value) || 2000)}
                                min={500}
                                max={30000}
                                step={500}
                                className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Intervalle de mise à jour pour le streaming (500-30000ms)
                            </p>
                        </div>

                        <Button onClick={handleSave} className="w-full">
                            <Save className="w-4 h-4 mr-2" />
                            Enregistrer la configuration
                        </Button>
                    </CardContent>
                </Card>

                {/* System Status */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>État du système</CardTitle>
                        <Button onClick={checkHealth} variant="ghost" size="sm">
                            <RefreshCw className={`w-4 h-4 ${healthLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* API Health */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                            <div className="flex items-center gap-3">
                                <Server className="w-5 h-5 text-muted-foreground" />
                                <span className="text-sm text-foreground">API Backend</span>
                            </div>
                            {healthLoading ? (
                                <Badge variant="default">Vérification...</Badge>
                            ) : healthError ? (
                                <Badge variant="offline">Hors ligne</Badge>
                            ) : (
                                <Badge variant="online">{health?.status || 'En ligne'}</Badge>
                            )}
                        </div>

                        {healthError && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                <span className="text-sm text-red-400">{healthError}</span>
                            </div>
                        )}

                        {health?.uptime_seconds && (
                            <div className="text-sm text-muted-foreground">
                                Uptime: {Math.floor(health.uptime_seconds / 3600)}h {Math.floor((health.uptime_seconds % 3600) / 60)}m
                            </div>
                        )}

                        {/* Demo Services */}
                        <div className="pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground mb-3">Services (démo)</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                    <span className="text-sm text-foreground">PostgreSQL</span>
                                    <Badge variant="online" size="sm">En ligne</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                    <span className="text-sm text-foreground">Kafka</span>
                                    <Badge variant="online" size="sm">En ligne</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                    <span className="text-sm text-foreground">API Gateway</span>
                                    <Badge variant="online" size="sm">En ligne</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Apparence</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {isDarkMode ? (
                                    <Moon className="w-5 h-5 text-primary" />
                                ) : (
                                    <Sun className="w-5 h-5 text-yellow-400" />
                                )}
                                <div>
                                    <p className="text-sm font-medium text-foreground">Mode sombre</p>
                                    <p className="text-xs text-muted-foreground">
                                        {isDarkMode ? 'Thème sombre activé' : 'Thème clair activé'}
                                    </p>
                                </div>
                            </div>
                            <Toggle enabled={isDarkMode} onChange={handleThemeToggle} />
                        </div>
                    </CardContent>
                </Card>

                {/* About */}
                <Card>
                    <CardHeader>
                        <CardTitle>À propos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Version</span>
                            <span className="text-sm text-foreground">1.0.0</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Framework</span>
                            <span className="text-sm text-foreground">Next.js 16</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Charts</span>
                            <span className="text-sm text-foreground">Recharts</span>
                        </div>
                        <div className="pt-3 border-t border-border">
                            <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">Dashboard fonctionnel</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
