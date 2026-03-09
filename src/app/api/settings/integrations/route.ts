import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser, isAdmin } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const store = getDemoStore();
  const providers = store.integrationProviders.filter((p) => p.tenant_id === user.tenant_id);
  const connections = store.providerConnections.filter((c) => c.tenant_id === user.tenant_id);
  const lastSyncs: Record<string, typeof store.syncRuns[0] | null> = {};

  for (const provider of providers) {
    const runs = store.syncRuns
      .filter((r) => r.provider_id === provider.id)
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
    lastSyncs[provider.id] = runs[0] || null;
  }

  const mappingCounts: Record<string, number> = {};
  for (const provider of providers) {
    mappingCounts[provider.id] = store.fieldMappings.filter(
      (m) => m.provider_id === provider.id
    ).length;
  }

  return NextResponse.json({
    providers,
    connections,
    lastSyncs,
    mappingCounts,
  });
}
