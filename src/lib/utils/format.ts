import { format, parseISO, formatDistanceToNow } from 'date-fns';
import type { WorkflowStatus } from '@/types/database';

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

export function formatDateRange(start: string, end: string): string {
  const s = parseISO(start);
  const e = parseISO(end);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${format(s, 'MMM d')}–${format(e, 'd, yyyy')}`;
  }
  if (s.getFullYear() === e.getFullYear()) {
    return `${format(s, 'MMM d')} – ${format(e, 'MMM d, yyyy')}`;
  }
  return `${format(s, 'MMM d, yyyy')} – ${format(e, 'MMM d, yyyy')}`;
}

export function formatTimeAgo(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function statusLabel(status: WorkflowStatus): string {
  const labels: Record<WorkflowStatus, string> = {
    not_started: 'Not Started',
    brief_ready: 'Brief Ready',
    draft_created: 'Draft Created',
    sent: 'Sent',
    awaiting_reply: 'Awaiting Reply',
    confirmed: 'Confirmed',
  };
  return labels[status];
}

export function statusColor(status: WorkflowStatus): string {
  const colors: Record<WorkflowStatus, string> = {
    not_started: 'bg-zinc-700 text-zinc-300',
    brief_ready: 'bg-amber-900/50 text-amber-300',
    draft_created: 'bg-blue-900/50 text-blue-300',
    sent: 'bg-purple-900/50 text-purple-300',
    awaiting_reply: 'bg-orange-900/50 text-orange-300',
    confirmed: 'bg-emerald-900/50 text-emerald-300',
  };
  return colors[status];
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
