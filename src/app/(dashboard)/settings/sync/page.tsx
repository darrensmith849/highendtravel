'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Play,
  Mail,
  Database,
  FolderOpen,
} from 'lucide-react';
import type { IntegrationProvider, ProviderSyncRun } from '@/types/database';
import { formatTimeAgo, cn } from '@/lib/utils/format';

const providerIcons: Record<string, typeof Mail> = {
  gmail: Mail,
  notion: Database,
  sharefile: FolderOpen,
};

export default function SyncPage() {
  const [providers, setProviders] = useState<IntegrationProvider[]>([]);
  const [runs, setRuns] = useState<ProviderSyncRun[]>([]);
  const [triggering, setTriggering] = useState<string | null>(null);

  const load = () => {
    fetch('/api/settings/sync')
      .then((r) => r.json())
      .then((data) => {
        setProviders(data.providers);
        setRuns(data.runs);
      });
  };

  useEffect(() => { load(); }, []);

  const triggerSync = async (providerId: string) => {
    setTriggering(providerId);
    await fetch('/api/settings/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerId }),
    });
    load();
    setTriggering(null);
  };

  if (!providers.length) return <div className="animate-pulse text-muted">Loading sync data...</div>;

  const getProviderName = (id: string) => providers.find((p) => p.id === id)?.display_name || 'Unknown';
  const getProviderType = (id: string) => providers.find((p) => p.id === id)?.provider_type || 'notion';

  // Last successful sync per provider
  const lastSuccess: Record<string, ProviderSyncRun | undefined> = {};
  for (const p of providers) {
    lastSuccess[p.id] = runs.find(
      (r) => r.provider_id === p.id && r.status === 'success'
    );
  }

  return (
    <div className="max-w-5xl">
      {/* Provider cards with trigger */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {providers.map((p) => {
          const Icon = providerIcons[p.provider_type] || Database;
          const last = lastSuccess[p.id];
          return (
            <div key={p.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-medium text-foreground">{p.display_name}</h3>
                </div>
                <button
                  onClick={() => triggerSync(p.id)}
                  disabled={triggering !== null}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-md text-xs hover:bg-accent/20 transition-colors disabled:opacity-50"
                >
                  <Play className="w-3 h-3" />
                  {triggering === p.id ? 'Running...' : 'Run Sync'}
                </button>
              </div>
              <div className="text-xs text-muted">
                <p>Last success: {last ? formatTimeAgo(last.started_at) : 'Never'}</p>
                {last && (
                  <p className="text-emerald-400/70 mt-0.5">
                    {last.records_processed} processed, {last.records_updated} updated
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Run history */}
      <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-4">
        Sync History
      </h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Provider</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Status</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Started</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Duration</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Records</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Error</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => {
              const ProvIcon = providerIcons[getProviderType(run.provider_id)] || Database;
              const duration = run.ended_at
                ? `${((new Date(run.ended_at).getTime() - new Date(run.started_at).getTime()) / 1000).toFixed(1)}s`
                : '—';
              return (
                <tr key={run.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ProvIcon className="w-3.5 h-3.5 text-muted" />
                      <span className="text-sm text-foreground">{getProviderName(run.provider_id)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium',
                      run.status === 'success' ? 'bg-emerald-900/30 text-emerald-300' :
                      run.status === 'warning' ? 'bg-amber-900/30 text-amber-300' :
                      run.status === 'failed' ? 'bg-red-900/30 text-red-300' :
                      'bg-blue-900/30 text-blue-300'
                    )}>
                      {run.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> :
                       run.status === 'warning' ? <AlertTriangle className="w-3 h-3" /> :
                       run.status === 'failed' ? <XCircle className="w-3 h-3" /> :
                       <Clock className="w-3 h-3" />}
                      {run.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{formatTimeAgo(run.started_at)}</td>
                  <td className="px-4 py-3 text-xs text-muted font-mono">{duration}</td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {run.records_processed} processed
                    {run.records_created > 0 && <span className="text-emerald-400/70"> +{run.records_created}</span>}
                    {run.records_updated > 0 && <span className="text-blue-400/70"> ~{run.records_updated}</span>}
                    {run.records_failed > 0 && <span className="text-red-400/70"> !{run.records_failed}</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted/60 max-w-[200px] truncate">
                    {run.error_summary || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {runs.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">
            No sync runs recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
