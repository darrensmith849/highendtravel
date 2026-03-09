import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const store = getDemoStore();
  const providers = store.integrationProviders.filter((p) => p.tenant_id === user.tenant_id);
  const runs = store.syncRuns
    .filter((r) => r.tenant_id === user.tenant_id)
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());

  return NextResponse.json({ providers, runs });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const { providerId } = body;

  const store = getDemoStore();
  const provider = store.integrationProviders.find(
    (p) => p.id === providerId && p.tenant_id === user.tenant_id
  );
  if (!provider) return NextResponse.json({ error: 'Provider not found' }, { status: 404 });

  const now = new Date().toISOString();
  const processed = Math.floor(Math.random() * 8) + 2;
  const created = Math.floor(Math.random() * 2);
  const updated = Math.floor(Math.random() * (processed - created));

  const run = {
    id: uuid(),
    tenant_id: user.tenant_id,
    provider_id: providerId,
    status: 'success' as const,
    started_at: now,
    ended_at: new Date(Date.now() + Math.random() * 15000).toISOString(),
    records_processed: processed,
    records_created: created,
    records_updated: updated,
    records_failed: 0,
    error_summary: null,
    created_at: now,
  };

  store.syncRuns.push(run);

  await logAuditEvent({
    tenantId: user.tenant_id,
    userId: user.id,
    action: 'triggered_sync',
    resourceType: 'provider_sync_run',
    resourceId: run.id,
  });

  return NextResponse.json(run);
}
