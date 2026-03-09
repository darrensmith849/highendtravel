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
  const prompt = store.promptConfigs.find(
    (p) => p.id === id && p.tenant_id === user.tenant_id
  );
  if (!prompt) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (body.system_prompt !== undefined) prompt.system_prompt = body.system_prompt;
  if (body.tone_profile !== undefined) prompt.tone_profile = body.tone_profile;
  if (body.extra_detail_enabled !== undefined) prompt.extra_detail_enabled = body.extra_detail_enabled;
  if (body.banned_phrases !== undefined) prompt.banned_phrases = body.banned_phrases;
  if (body.style_guidelines !== undefined) prompt.style_guidelines = body.style_guidelines;
  prompt.last_edited_by = user.id;
  prompt.updated_at = new Date().toISOString();

  await logAuditEvent({
    tenantId: user.tenant_id,
    userId: user.id,
    action: 'updated_prompt',
    resourceType: 'prompt_config',
    resourceId: prompt.id,
  });

  return NextResponse.json(prompt);
}
