import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser, canGenerateBriefs } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!canGenerateBriefs(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { tripId, bookingId } = body;

  const store = getDemoStore();
  const trip = store.trips.find((t) => t.id === tripId && t.tenant_id === user.tenant_id);
  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  }

  const booking = store.hotelBookings.find((b) => b.id === bookingId && b.trip_id === tripId);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const hotel = store.hotelContacts.find((h) => h.id === booking.hotel_contact_id);
  const client = store.clients.find((c) => c.id === trip.client_id);
  const travellers = store.travellers.filter((t) => t.client_id === trip.client_id);
  const preferences = store.preferences.filter((p) => p.trip_id === tripId);

  // Generate a synthetic AI booking brief
  const travellerDetails = travellers
    .map((t) => {
      const parts = [`- **${t.full_name}**`];
      if (t.passport_nationality) parts.push(`(${t.passport_nationality})`);
      if (t.dietary_requirements) parts.push(`— Diet: ${t.dietary_requirements}`);
      if (t.special_requests) parts.push(`— ${t.special_requests}`);
      return parts.join(' ');
    })
    .join('\n');

  const prefDetails = preferences
    .map((p) => `- **${p.preference_key}:** ${p.preference_value}`)
    .join('\n');

  const content = `## Booking Brief: ${hotel?.hotel_name || 'Hotel'}

**Client:** ${client?.full_name || 'Unknown'}
**Trip:** ${trip.title}
**Dates:** ${booking.check_in} to ${booking.check_out}
**Room:** ${booking.room_type || 'To be confirmed'}
**Guests:** ${booking.guests}

### Travellers
${travellerDetails || 'No traveller details available'}

### Preferences & Requirements
${prefDetails || 'No preferences recorded'}

### Special Requests
${booking.special_requests || 'None specified'}

### Internal Notes
${trip.internal_notes || 'None'}

### Communication Style
Professional, warm tone. Reference the occasion and any personal details that demonstrate attentive service.`;

  const now = new Date().toISOString();
  const brief = {
    id: uuid(),
    tenant_id: user.tenant_id,
    trip_id: tripId,
    hotel_booking_id: bookingId,
    content,
    generated_at: now,
    created_by: user.id,
    created_at: now,
    updated_at: now,
  };

  store.bookingBriefs.push(brief);

  // Update booking status if currently not_started
  if (booking.status === 'not_started') {
    booking.status = 'brief_ready';
    booking.updated_at = now;
    store.workflowEvents.push({
      id: uuid(),
      tenant_id: user.tenant_id,
      trip_id: tripId,
      hotel_booking_id: bookingId,
      from_status: 'not_started',
      to_status: 'brief_ready',
      changed_by: user.id,
      note: 'Booking brief generated',
      created_at: now,
    });
  }

  await logAuditEvent({
    tenantId: user.tenant_id,
    userId: user.id,
    action: 'generated_brief',
    resourceType: 'booking_brief',
    resourceId: brief.id,
  });

  return NextResponse.json(brief);
}
