import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser, canGenerateEmails } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { gmail } from '@/lib/integrations';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!canGenerateEmails(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { tripId, bookingId } = body;

  const store = getDemoStore();
  const trip = store.trips.find((t) => t.id === tripId && t.tenant_id === user.tenant_id);
  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  }

  const booking = store.hotelBookings.find((b) => b.id === bookingId);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const hotel = store.hotelContacts.find((h) => h.id === booking.hotel_contact_id);
  const client = store.clients.find((c) => c.id === trip.client_id);
  const travellers = store.travellers.filter((t) => t.client_id === trip.client_id);

  if (!hotel) {
    return NextResponse.json({ error: 'Hotel contact not found' }, { status: 404 });
  }

  // Generate email draft
  const travellerNames = travellers.map((t) => t.full_name).join(', ');
  const dietaryNotes = travellers
    .filter((t) => t.dietary_requirements)
    .map((t) => `${t.full_name}: ${t.dietary_requirements}`)
    .join('; ');
  const subject = `Reservation Enquiry — ${client?.full_name || 'Guest'}, ${booking.check_in} to ${booking.check_out}, ${booking.room_type || 'Suite'}`;

  const emailBody = `Dear ${hotel.contact_name},

I hope this message finds you well. I am writing on behalf of my client${travellers.length > 1 ? 's' : ''}, ${client?.full_name || 'our guest'}, regarding a stay at ${hotel.hotel_name}.

We would like to enquire about availability for the following:

**Dates:** ${booking.check_in} to ${booking.check_out}
**Room:** ${booking.room_type || 'Best available suite'}
**Guests:** ${booking.guests}
**Travellers:** ${travellerNames}

${booking.special_requests ? `**Special Requests:**\n${booking.special_requests}\n` : ''}${dietaryNotes ? `**Dietary Requirements:**\n${dietaryNotes}\n` : ''}
Please confirm availability and your best available rate for this period.

Warm regards,
${user.full_name}
Maison Atlas Journeys`;

  const draft = await gmail.createDraft(user.tenant_id, {
    subject,
    body: emailBody,
    toEmail: hotel.contact_email,
    bookingId,
    userId: user.id,
  });

  // Update booking status
  if (booking.status === 'brief_ready' || booking.status === 'not_started') {
    const oldStatus = booking.status;
    booking.status = 'draft_created';
    booking.updated_at = new Date().toISOString();
    store.workflowEvents.push({
      id: uuid(),
      tenant_id: user.tenant_id,
      trip_id: tripId,
      hotel_booking_id: bookingId,
      from_status: oldStatus,
      to_status: 'draft_created',
      changed_by: user.id,
      note: 'Hotel email draft generated',
      created_at: new Date().toISOString(),
    });
  }

  await logAuditEvent({
    tenantId: user.tenant_id,
    userId: user.id,
    action: 'generated_email',
    resourceType: 'email_draft',
    resourceId: draft.id,
  });

  return NextResponse.json(draft);
}
