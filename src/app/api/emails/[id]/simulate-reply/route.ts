import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser } from '@/lib/auth';
import { gmail } from '@/lib/integrations';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const draft = await gmail.simulateReply(user.tenant_id, id, body.replyBody || 'Thank you for your enquiry. We are pleased to confirm availability.');
  if (!draft) {
    return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
  }

  // Update booking to awaiting_reply
  const store = getDemoStore();
  const emailDraft = store.emailDrafts.find((e) => e.id === id);
  if (emailDraft) {
    const booking = store.hotelBookings.find((b) => b.id === emailDraft.hotel_booking_id);
    if (booking) {
      booking.status = 'awaiting_reply';
      booking.updated_at = new Date().toISOString();
    }
  }

  return NextResponse.json(draft);
}
