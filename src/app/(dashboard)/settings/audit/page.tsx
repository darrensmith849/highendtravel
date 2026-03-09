'use client';

import { useEffect, useState } from 'react';
import {
  ClipboardList,
  Filter,
  User,
  Eye,
  Sparkles,
  Mail,
  ArrowRightLeft,
  Settings,
  RefreshCw,
} from 'lucide-react';
import type { AuditLog, AuditAction } from '@/types/database';
import { demoUsers } from '@/lib/demo-data';
import { formatTimeAgo } from '@/lib/utils/format';

const actionIcons: Record<string, typeof Eye> = {
  viewed_trip: Eye,
  generated_brief: Sparkles,
  generated_email: Mail,
  changed_status: ArrowRightLeft,
  viewed_document: ClipboardList,
  updated_settings: Settings,
  updated_template: Mail,
  updated_mapping: ArrowRightLeft,
  updated_prompt: Sparkles,
  triggered_sync: RefreshCw,
};

const actionLabels: Record<string, string> = {
  viewed_trip: 'Viewed Trip',
  generated_brief: 'Generated Brief',
  generated_email: 'Generated Email',
  changed_status: 'Changed Status',
  viewed_document: 'Viewed Document',
  updated_settings: 'Updated Settings',
  updated_template: 'Updated Template',
  updated_mapping: 'Updated Mapping',
  updated_prompt: 'Updated Prompt',
  triggered_sync: 'Triggered Sync',
};

const allActions: AuditAction[] = [
  'viewed_trip',
  'generated_brief',
  'generated_email',
  'changed_status',
  'viewed_document',
  'updated_settings',
  'updated_template',
  'updated_mapping',
  'updated_prompt',
  'triggered_sync',
];

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [actionFilter, setActionFilter] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [entityFilter, setEntityFilter] = useState<string>('');

  const load = () => {
    const params = new URLSearchParams();
    if (actionFilter) params.set('action', actionFilter);
    if (userFilter) params.set('userId', userFilter);
    if (entityFilter) params.set('resourceType', entityFilter);
    fetch(`/api/settings/audit?${params.toString()}`)
      .then((r) => r.json())
      .then(setLogs);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [actionFilter, userFilter, entityFilter]);

  const getUserName = (userId: string) =>
    demoUsers.find((u) => u.id === userId)?.full_name || userId.slice(0, 8);

  return (
    <div className="max-w-5xl">
      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-muted" />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-accent/50"
        >
          <option value="">All Actions</option>
          {allActions.map((a) => (
            <option key={a} value={a}>{actionLabels[a]}</option>
          ))}
        </select>
        <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-accent/50"
        >
          <option value="">All Users</option>
          {demoUsers.map((u) => (
            <option key={u.id} value={u.id}>{u.full_name}</option>
          ))}
        </select>
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-accent/50"
        >
          <option value="">All Entities</option>
          <option value="trip">Trip</option>
          <option value="hotel_booking">Hotel Booking</option>
          <option value="booking_brief">Booking Brief</option>
          <option value="email_draft">Email Draft</option>
          <option value="tenant_settings">Settings</option>
          <option value="email_template">Template</option>
          <option value="prompt_config">Prompt Config</option>
          <option value="field_mapping">Field Mapping</option>
          <option value="provider_sync_run">Sync Run</option>
        </select>
        {(actionFilter || userFilter || entityFilter) && (
          <button
            onClick={() => { setActionFilter(''); setUserFilter(''); setEntityFilter(''); }}
            className="text-xs text-muted hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Log table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Time</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Actor</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Action</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Entity</th>
              <th className="text-left px-4 py-3 text-[10px] text-muted uppercase tracking-wider font-medium">Resource ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const ActionIcon = actionIcons[log.action] || ClipboardList;
              return (
                <tr key={log.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                  <td className="px-4 py-3 text-xs text-muted">{formatTimeAgo(log.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-muted" />
                      <span className="text-sm text-foreground">{getUserName(log.user_id)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <ActionIcon className="w-3 h-3 text-accent" />
                      <span className="text-xs text-foreground">{actionLabels[log.action] || log.action}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted capitalize">
                    {log.resource_type.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3 text-[10px] text-muted/50 font-mono">
                    {log.resource_id.slice(0, 8)}...
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div className="text-center py-16 text-muted text-sm">
            <ClipboardList className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <p>No audit events recorded yet.</p>
            <p className="text-xs text-muted/50 mt-1">
              Events are logged as you interact with trips and settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
