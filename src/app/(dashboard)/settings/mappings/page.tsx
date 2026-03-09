'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MinusCircle,
  Mail,
  Database,
  FolderOpen,
  FlaskConical,
} from 'lucide-react';
import type { IntegrationProvider, ProviderFieldMapping } from '@/types/database';
import { cn } from '@/lib/utils/format';

const providerIcons: Record<string, typeof Mail> = {
  gmail: Mail,
  notion: Database,
  sharefile: FolderOpen,
};

export default function MappingsPage() {
  const [providers, setProviders] = useState<IntegrationProvider[]>([]);
  const [mappings, setMappings] = useState<ProviderFieldMapping[]>([]);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings/mappings')
      .then((r) => r.json())
      .then((data) => {
        setProviders(data.providers);
        setMappings(data.mappings);
        if (data.providers.length > 0) setActiveProvider(data.providers[0].id);
      });
  }, []);

  if (!providers.length) return <div className="animate-pulse text-muted">Loading mappings...</div>;

  const filtered = mappings.filter((m) => m.provider_id === activeProvider);
  const activeProviderData = providers.find((p) => p.id === activeProvider);
  const validCount = filtered.filter((m) => m.status === 'valid').length;
  const requiredCount = filtered.filter((m) => m.is_required).length;

  return (
    <div className="max-w-5xl">
      {/* Provider tabs */}
      <div className="flex gap-2 mb-6">
        {providers.map((p) => {
          const Icon = providerIcons[p.provider_type] || Database;
          const count = mappings.filter((m) => m.provider_id === p.id).length;
          return (
            <button
              key={p.id}
              onClick={() => setActiveProvider(p.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors border',
                activeProvider === p.id
                  ? 'border-accent/30 bg-accent/5 text-accent'
                  : 'border-border text-muted hover:text-foreground hover:bg-card-hover'
              )}
            >
              <Icon className="w-4 h-4" />
              {p.display_name}
              <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px]">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      {activeProviderData && (
        <div className="flex gap-4 mb-6">
          <div className="px-4 py-3 bg-card border border-border rounded-lg">
            <p className="text-[10px] text-muted uppercase tracking-wider">Total Mappings</p>
            <p className="text-lg font-medium text-foreground">{filtered.length}</p>
          </div>
          <div className="px-4 py-3 bg-card border border-border rounded-lg">
            <p className="text-[10px] text-muted uppercase tracking-wider">Valid</p>
            <p className="text-lg font-medium text-emerald-400">{validCount}</p>
          </div>
          <div className="px-4 py-3 bg-card border border-border rounded-lg">
            <p className="text-[10px] text-muted uppercase tracking-wider">Required</p>
            <p className="text-lg font-medium text-foreground">{requiredCount}</p>
          </div>
          <div className="flex-1" />
          <div className="flex items-center px-4 py-3 bg-card border border-border rounded-lg">
            <FlaskConical className="w-3.5 h-3.5 text-amber-400 mr-2" />
            <span className="text-xs text-amber-400">Mock data previews</span>
          </div>
        </div>
      )}

      {/* Mapping table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Status</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Source Field</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium w-8"></th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Target</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Required</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Sample Value</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                <td className="px-4 py-3">
                  {m.status === 'valid' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : m.status === 'invalid' ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <MinusCircle className="w-4 h-4 text-zinc-500" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-foreground">{m.source_label}</p>
                  <p className="text-[10px] text-muted font-mono">{m.source_field}</p>
                </td>
                <td className="px-4 py-3">
                  <ArrowRight className="w-3.5 h-3.5 text-muted" />
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-foreground">{m.target_label}</p>
                  <p className="text-[10px] text-muted font-mono">{m.target_table}.{m.target_field}</p>
                </td>
                <td className="px-4 py-3">
                  {m.is_required ? (
                    <span className="px-2 py-0.5 bg-amber-900/20 text-amber-300 rounded text-[10px] font-medium">
                      Required
                    </span>
                  ) : (
                    <span className="text-xs text-muted">Optional</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs text-muted/70 font-mono max-w-[200px] truncate">
                    {m.sample_value || '—'}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">
            No field mappings configured for this provider.
          </div>
        )}
      </div>
    </div>
  );
}
