'use client';

import { useEffect, useState } from 'react';
import {
  Mail,
  Database,
  FolderOpen,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightLeft,
  FlaskConical,
} from 'lucide-react';
import type { IntegrationProvider, ProviderConnection, ProviderSyncRun } from '@/types/database';
import { formatTimeAgo, cn } from '@/lib/utils/format';

const providerIcons: Record<string, typeof Mail> = {
  gmail: Mail,
  notion: Database,
  sharefile: FolderOpen,
};

export default function IntegrationsPage() {
  const [data, setData] = useState<{
    providers: IntegrationProvider[];
    connections: ProviderConnection[];
    lastSyncs: Record<string, ProviderSyncRun | null>;
    mappingCounts: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    fetch('/api/settings/integrations')
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <div className="animate-pulse text-muted">Loading integrations...</div>;

  return (
    <div className="max-w-4xl">
      <div className="grid gap-6">
        {data.providers.map((provider) => {
          const Icon = providerIcons[provider.provider_type] || Database;
          const connection = data.connections.find((c) => c.provider_id === provider.id);
          const lastSync = data.lastSyncs[provider.id];
          const mappingCount = data.mappingCounts[provider.id] || 0;

          return (
            <div
              key={provider.id}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-foreground">
                      {provider.display_name}
                    </h3>
                    <p className="text-xs text-muted">{provider.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-900/20 text-amber-300 rounded-md text-[11px] font-medium">
                    <FlaskConical className="w-3 h-3" />
                    {provider.mode}
                  </span>
                  {connection && (
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium',
                        connection.status === 'connected'
                          ? 'bg-emerald-900/30 text-emerald-300'
                          : 'bg-red-900/30 text-red-300'
                      )}
                    >
                      {connection.status === 'connected' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {connection.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1 p-3 bg-background border border-border/50 rounded-lg">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Last Sync</p>
                  <p className="text-sm text-foreground">
                    {lastSync ? formatTimeAgo(lastSync.started_at) : 'Never'}
                  </p>
                </div>
                <div className="flex-1 p-3 bg-background border border-border/50 rounded-lg">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Sync Result</p>
                  <p className="text-sm text-foreground">
                    {lastSync ? (
                      <span
                        className={cn(
                          lastSync.status === 'success'
                            ? 'text-emerald-400'
                            : lastSync.status === 'warning'
                              ? 'text-amber-400'
                              : 'text-red-400'
                        )}
                      >
                        {lastSync.status} — {lastSync.records_processed} records
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </p>
                </div>
                <div className="flex-1 p-3 bg-background border border-border/50 rounded-lg">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Mapped Fields</p>
                  <div className="flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-muted" />
                    <p className="text-sm text-foreground">{mappingCount}</p>
                  </div>
                </div>
              </div>

              {/* Config checklist */}
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider mb-2">
                  Configuration Checklist
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {provider.config_checklist.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-muted"
                    >
                      {item.done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      )}
                      <span className={item.done ? 'text-foreground/70' : ''}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
