import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser, isAdmin } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const store = getDemoStore();
  const templates = store.emailTemplates.filter((t) => t.tenant_id === user.tenant_id);
  return NextResponse.json(templates);
}
