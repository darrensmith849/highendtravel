import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const store = getDemoStore();
  const template = store.emailTemplates.find(
    (t) => t.id === id && t.tenant_id === user.tenant_id
  );
  if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (body.name !== undefined) template.name = body.name;
  if (body.subject_template !== undefined) template.subject_template = body.subject_template;
  if (body.body_template !== undefined) template.body_template = body.body_template;
  if (body.is_active !== undefined) template.is_active = body.is_active;
  template.version += 1;
  template.last_edited_by = user.id;
  template.updated_at = new Date().toISOString();

  await logAuditEvent({
    tenantId: user.tenant_id,
    userId: user.id,
    action: 'updated_template',
    resourceType: 'email_template',
    resourceId: template.id,
  });

  return NextResponse.json(template);
}
