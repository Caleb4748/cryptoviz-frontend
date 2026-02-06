'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Activity, Clock, Zap, Database, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { fetchOverview, fetchMentionsTimeseries, fetchRecentEvents } from '@/lib/api';
import { formatDate, formatNumber, formatCompactNumber } from '@/lib/utils';
import { OverviewResponse, TimeSeriesResponse, RecentEventsResponse } from '@/types/api';
import { Card, CardHeader, CardTitle, CardContent, Button, SkeletonChart } from '@/components/ui';
import { KPICard, EventsList } from '@/components/dashboard';
import { MentionsChart } from '@/components/charts';

const REFRESH_INTERVAL = 10000; // 10 seconds

export default function OverviewPage() {
  const [hasError, setHasError] = useState(false);

  // Auto-refresh overview data
  const {
    data: overview,
    error: overviewError,
    isLoading: overviewLoading,
    refresh: refreshOverview,
  } = useAutoRefresh<OverviewResponse>({
    fetchFn: useCallback(async () => {
      const data = await fetchOverview();
      setHasError(false);
      return data;
    }, []),
    intervalMs: REFRESH_INTERVAL,
  });

  // Auto-refresh mentions timeseries
  const {
    data: mentions,
    error: mentionsError,
    isLoading: mentionsLoading,
    refresh: refreshMentions,
  } = useAutoRefresh<TimeSeriesResponse>({
    fetchFn: useCallback(() => fetchMentionsTimeseries('60m', '1m'), []),
    intervalMs: REFRESH_INTERVAL,
  });

  // Auto-refresh recent events
  const {
    data: events,
    error: eventsError,
    isLoading: eventsLoading,
    refresh: refreshEvents,
  } = useAutoRefresh<RecentEventsResponse>({
    fetchFn: useCallback(() => fetchRecentEvents(20), []),
    intervalMs: REFRESH_INTERVAL,
  });

  // Handle combined error state
  const hasAnyError = overviewError || mentionsError || eventsError;

  // Show error toast on new errors
  if (hasAnyError && !hasError) {
    setHasError(true);
    toast.error('Erreur de connexion au backend', {
      description: 'Certaines données peuvent être indisponibles',
    });
  }

  const handleRetry = () => {
    refreshOverview();
    refreshMentions();
    refreshEvents();
    toast.info('Tentative de reconnexion...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vue d&apos;ensemble</h1>
          <p className="text-muted-foreground">Surveillance en temps réel du marché crypto</p>
        </div>
        <Button onClick={handleRetry} variant="ghost" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Error Banner */}
      {hasAnyError && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div className="flex-1">
                <p className="text-red-400 font-medium">Backend indisponible</p>
                <p className="text-sm text-red-400/70">
                  Impossible de se connecter au serveur. Vérifiez que le backend est en cours d&apos;exécution.
                </p>
              </div>
              <Button onClick={handleRetry} variant="danger" size="sm">
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Flux actifs"
          value={overview?.activeStreams ?? '-'}
          icon={Activity}
          isLoading={overviewLoading}
        />
        <KPICard
          title="Dernière mise à jour"
          value={overview?.lastUpdate ? formatDate(overview.lastUpdate) : '-'}
          icon={Clock}
          isLoading={overviewLoading}
        />
        <KPICard
          title="Latence moyenne"
          value={overview ? `${overview.avgLatencyMs} ms` : '-'}
          icon={Zap}
          isLoading={overviewLoading}
        />
        <KPICard
          title="Points de données"
          value={overview ? formatCompactNumber(overview.dataPointsCollected) : '-'}
          icon={Database}
          isLoading={overviewLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentions Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          {mentionsLoading ? (
            <SkeletonChart />
          ) : mentionsError ? (
            <Card>
              <CardHeader>
                <CardTitle>Mentions crypto par minute</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Impossible de charger les données
                </div>
              </CardContent>
            </Card>
          ) : mentions && mentions.points.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Mentions crypto par minute</CardTitle>
              </CardHeader>
              <CardContent>
                <MentionsChart data={mentions.points} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Mentions crypto par minute</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Aucune donnée disponible
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Events List - Takes 1 column */}
        <div>
          <EventsList
            events={events?.items ?? []}
            isLoading={eventsLoading}
          />
        </div>
      </div>
    </div>
  );
}
