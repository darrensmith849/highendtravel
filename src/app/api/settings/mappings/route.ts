import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const store = getDemoStore();
  const providers = store.integrationProviders.filter((p) => p.tenant_id === user.tenant_id);
  const mappings = store.fieldMappings.filter((m) => m.tenant_id === user.tenant_id);

  return NextResponse.json({ providers, mappings });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const { mappingId, target_table, target_field, target_label, status: newStatus } = body;

  const store = getDemoStore();
  const mapping = store.fieldMappings.find(
    (m) => m.id === mappingId && m.tenant_id === user.tenant_id
  );
  if (!mapping) return NextResponse.json({ error: 'Mapping not found' }, { status: 404 });

  if (target_table !== undefined) mapping.target_table = target_table;
  if (target_field !== undefined) mapping.target_field = target_field;
  if (target_label !== undefined) mapping.target_label = target_label;
  if (newStatus !== undefined) mapping.status = newStatus;
  mapping.updated_at = new Date().toISOString();

  await logAuditEvent({
    tenantId: user.tenant_id,
    userId: user.id,
    action: 'updated_mapping',
    resourceType: 'field_mapping',
    resourceId: mapping.id,
  });

  return NextResponse.json(mapping);
}
