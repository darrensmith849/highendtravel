import { NextResponse } from 'next/server';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { getAuditLogs } from '@/lib/audit';

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const actionFilter = searchParams.get('action');
  const userFilter = searchParams.get('userId');
  const entityFilter = searchParams.get('resourceType');

  let logs = getAuditLogs(user.tenant_id);

  if (actionFilter) logs = logs.filter((l) => l.action === actionFilter);
  if (userFilter) logs = logs.filter((l) => l.user_id === userFilter);
  if (entityFilter) logs = logs.filter((l) => l.resource_type === entityFilter);

  logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json(logs.slice(0, 100));
}
