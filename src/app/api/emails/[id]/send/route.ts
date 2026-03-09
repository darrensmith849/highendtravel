import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser, canGenerateEmails } from '@/lib/auth';
import { gmail } from '@/lib/integrations';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!canGenerateEmails(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const draft = await gmail.markAsSent(user.tenant_id, id);
  if (!draft) {
    return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
  }

  // Update the associated booking status
  const store = getDemoStore();
  const emailDraft = store.emailDrafts.find((e) => e.id === id);
  if (emailDraft) {
    const booking = store.hotelBookings.find((b) => b.id === emailDraft.hotel_booking_id);
    if (booking && (booking.status === 'draft_created' || booking.status === 'brief_ready')) {
      booking.status = 'sent';
      booking.updated_at = new Date().toISOString();
    }
  }

  return NextResponse.json(draft);
}
