'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Activity, Wifi, WifiOff, RefreshCw, AlertTriangle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { formatTimestamp, formatCompactNumber } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { KPICard, AssetsTable } from '@/components/dashboard';

export default function OverviewPage() {
  const { data: cryptos, isConnected, error } = useWebSocket({
    enabled: true,
    pollingIntervalMs: 5000,
  });

  const [hasShownError, setHasShownError] = useState(false);

  // Show error toast on new errors
  if (error && !hasShownError) {
    setHasShownError(true);
    toast.error('Erreur de connexion', {
      description: error,
    });
  }

  // Reset error state when connection is restored
  if (!error && hasShownError) {
    setHasShownError(false);
  }

  const handleRetry = () => {
    window.location.reload();
    toast.info('Actualisation de la page...');
  };

  // Calculate derived KPIs
  const totalCryptos = cryptos.length;
  const upTrends = cryptos.filter(c => c.trend === 'up').length;
  const downTrends = cryptos.filter(c => c.trend === 'down').length;
  const lastUpdate = cryptos.length > 0
    ? Math.max(...cryptos.map(c => c.timestamp))
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vue d&apos;ensemble</h1>
          <p className="text-muted-foreground">Surveillance en temps réel du marché crypto</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Connection Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${isConnected
              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
            }`}>
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4" />
                WebSocket
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                Polling
              </>
            )}
          </div>
          <Button onClick={handleRetry} variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div className="flex-1">
                <p className="text-yellow-400 font-medium">Mode dégradé actif</p>
                <p className="text-sm text-yellow-400/70">
                  {error}
                </p>
              </div>
              <Button onClick={handleRetry} variant="secondary" size="sm">
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Cryptomonnaies suivies"
          value={totalCryptos > 0 ? totalCryptos : '-'}
          icon={Activity}
          isLoading={totalCryptos === 0 && !error}
        />
        <KPICard
          title="Tendance haussière"
          value={upTrends > 0 ? upTrends : '-'}
          icon={TrendingUp}
          isLoading={totalCryptos === 0 && !error}
        />
        <KPICard
          title="Tendance baissière"
          value={downTrends > 0 ? downTrends : '-'}
          icon={TrendingDown}
          isLoading={totalCryptos === 0 && !error}
        />
        <KPICard
          title="Dernière mise à jour"
          value={lastUpdate ? formatTimestamp(lastUpdate) : '-'}
          icon={Clock}
          isLoading={totalCryptos === 0 && !error}
        />
      </div>

      {/* Main Assets Table */}
      <AssetsTable
        assets={cryptos}
        isLoading={totalCryptos === 0 && !error}
      />
    </div>
  );
}
