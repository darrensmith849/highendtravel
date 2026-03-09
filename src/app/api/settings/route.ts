import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const store = getDemoStore();
  return NextResponse.json({
    tenant: store.tenant,
    settings: store.tenantSettings,
  });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const store = getDemoStore();
  const s = store.tenantSettings;

  if (body.brand_name !== undefined) s.brand_name = body.brand_name;
  if (body.support_email !== undefined) s.support_email = body.support_email;
  if (body.default_timezone !== undefined) s.default_timezone = body.default_timezone;
  if (body.operational_notes !== undefined) s.operational_notes = body.operational_notes;
  if (body.default_draft_status !== undefined) s.default_draft_status = body.default_draft_status;
  if (body.reply_followup_days !== undefined) s.reply_followup_days = body.reply_followup_days;
  if (body.internal_review_required !== undefined) s.internal_review_required = body.internal_review_required;
  if (body.email_generation_mode !== undefined) s.email_generation_mode = body.email_generation_mode;
  if (body.tenant_name !== undefined) store.tenant.name = body.tenant_name;
  s.updated_at = new Date().toISOString();

  await logAuditEvent({
    tenantId: user.tenant_id,
    userId: user.id,
    action: 'updated_settings',
    resourceType: 'tenant_settings',
    resourceId: s.id,
  });

  return NextResponse.json({ tenant: store.tenant, settings: s });
}
