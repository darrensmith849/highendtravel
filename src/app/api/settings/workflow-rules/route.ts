import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser, isAdmin } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const store = getDemoStore();
  const rules = store.workflowRules.filter((r) => r.tenant_id === user.tenant_id);
  return NextResponse.json(rules);
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const { ruleId, enabled, allowed_roles } = body;

  const store = getDemoStore();
  const rule = store.workflowRules.find(
    (r) => r.id === ruleId && r.tenant_id === user.tenant_id
  );
  if (!rule) return NextResponse.json({ error: 'Rule not found' }, { status: 404 });

  if (enabled !== undefined) rule.enabled = enabled;
  if (allowed_roles !== undefined) rule.allowed_roles = allowed_roles;
  rule.updated_at = new Date().toISOString();

  return NextResponse.json(rule);
}
